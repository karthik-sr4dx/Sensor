import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorData } from 'src/entities/sensor.data.entity';
import { Repository } from 'typeorm';
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

      console.log("Data is received and saved");
      await this.sensorDataRepository.save(newSensorData);
    } catch (error) {
      console.error('Error saving sensor data to database:', error);
    }
  }

  async getData(limit? : number): Promise<SensorDataDto[]> {
    try {
      
      const sensorDataEntities = await this.sensorDataRepository.find({
        order: { timestamp: 'DESC' },
        take: limit || undefined, 
      });
      // Map the entities to DTOs
      return sensorDataEntities.map(sensorData => ({
        ident: sensorData.ident,
        temperature: sensorData.temperature,
        weight: sensorData.weight,
        timestamp: new Date(sensorData.timestamp).toISOString(),
      }));
    } catch (error) {
      console.error('Error retrieving sensor data:', error);
      throw new Error('Could not retrieve sensor data');
    }
  }
}
