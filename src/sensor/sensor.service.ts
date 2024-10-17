import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorData } from 'src/entities/sensor.data.entity';
import { In, Repository } from 'typeorm';
import { SensorDataDto } from './dto/sensor-data.dto';

@Injectable()
export class SensorService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private readonly MQTT_TOPIC = 'sensor/VibrationData';  // MQTT topic to subscribe to
  private readonly MQTT_HOST = 'mqtt://localhost:1883';  // RabbitMQ MQTT broker host

  constructor(
    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,
  ) {}

  async onModuleInit() {
    const clientId = `mqtt_client_subscriber_${Math.random().toString(16).slice(2, 10)}`;

    try {
      this.client = mqtt.connect(this.MQTT_HOST, {
        clientId,
        clean: false,
        reconnectPeriod: 1000,
      });

      this.client.on('connect', () => {
        console.log('MQTT Client Connected');
        this.client.subscribe(this.MQTT_TOPIC, { qos: 2 }, (err) => {
          if (!err) {
            console.log(`Subscribed to MQTT topic: ${this.MQTT_TOPIC}`);
          } else {
            console.error('Subscription error:', err);
          }
        });
      });

      this.client.on('message', async (topic, message) => {
        try {
          const sensorData = JSON.parse(message.toString());
          await this.handleSensorData(sensorData);
        } catch (error) {
          console.error('Error parsing sensor data:', error);
        }
      });

      this.client.on('error', (error) => {
        console.error('MQTT Connection Error:', error);
      });

      this.client.on('offline', () => {
        console.warn('MQTT Client went offline');
      });

      this.client.on('reconnect', () => {
        console.log('MQTT Client Reconnecting');
      });
    } catch (error) {
      console.error('Error initializing MQTT connection:', error);
    }
  }

  async onModuleDestroy() {
    this.client.end(true, () => {
      console.log('MQTT Client Disconnected');
    });
  }

  private async handleSensorData(sensorData: any) {
    try {
      const newSensorData = this.sensorDataRepository.create({
        ident: sensorData.ident,
        temperature: sensorData.temperature,
        weight: sensorData.weight, // Ensure this is in the sensorData payload
        timestamp: new Date(sensorData.timestamp * 1000).toISOString(),
      });

      // console.log("Data is received and saved");
      await this.sensorDataRepository.save(newSensorData);
    } catch (error) {
      console.error('Error saving sensor data to database:', error);
    }
  }
  async getData(limit?: number, startDate?: string, endDate?: string): Promise<{ data: { [sensorId: string]: SensorDataDto[] }, count: { [sensorId: string]: number } }> {
    try {
      const sensorIds = [
        'sensor_5746',
        'sensor_4958',
        'sensor_9532',
        'sensor_8661',
        'sensor_5217'
      ];
  
      const query = this.sensorDataRepository.createQueryBuilder('sensorData')
        .where('sensorData.ident IN (:...sensorIds)', { sensorIds });
  
      // Add date filtering using query builder
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00Z`); // Using UTC timezone explicitly
        query.andWhere('sensorData.timestamp >= :startDate', { startDate: start.toISOString() });
      }
  
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59Z`); // Using UTC timezone explicitly
        query.andWhere('sensorData.timestamp <= :endDate', { endDate: end.toISOString() });
      }
  
      // Apply limit if provided
      if (limit) {
        query.take(limit);
      }
  
      query.orderBy('sensorData.timestamp', 'DESC');
  
      const sensorDataEntities = await query.getMany();
  
      // Query to get the count of records per sensor ID
      const counts = await this.sensorDataRepository.createQueryBuilder('sensorData')
        .select('sensorData.ident', 'sensorId')
        .addSelect('COUNT(*)', 'count')
        .where('sensorData.ident IN (:...sensorIds)', { sensorIds })
        .andWhere(startDate ? 'sensorData.timestamp >= :startDate' : '1=1', { startDate: startDate ? new Date(`${startDate}T00:00:00Z`).toISOString() : undefined })
        .andWhere(endDate ? 'sensorData.timestamp <= :endDate' : '1=1', { endDate: endDate ? new Date(`${endDate}T23:59:59Z`).toISOString() : undefined })
        .groupBy('sensorData.ident')
        .getRawMany();
  
      // Prepare the response as before
      const countResult: { [sensorId: string]: number } = {};
      sensorIds.forEach(sensorId => {
        const sensorCount = counts.find(c => c.sensorId === sensorId);
        countResult[sensorId] = sensorCount ? parseInt(sensorCount.count, 10) : 0;
      });
  
      const dataResult: { [sensorId: string]: SensorDataDto[] } = {};
      sensorIds.forEach(sensorId => {
        dataResult[sensorId] = [];
      });
  
      sensorDataEntities.forEach(sensorData => {
        const sensorId = sensorData.ident;
        if (dataResult[sensorId]) {
          dataResult[sensorId].push({
            ident: sensorData.ident,
            temperature: sensorData.temperature,
            weight: sensorData.weight,
            timestamp: new Date(sensorData.timestamp).toISOString(),
          });
        }
      });
  
      return {
        data: dataResult,
        count: countResult
      };
    } catch (error) {
      console.error('Error retrieving sensor data:', error);
      throw new Error('Could not retrieve sensor data');
    }
  }
  
  
  
}
