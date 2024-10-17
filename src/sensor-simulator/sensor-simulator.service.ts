import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { promisify } from 'util';
import * as mqtt from 'mqtt';  // Import MQTT

@Injectable()
export class SensorSimulatorService implements OnModuleInit, OnModuleDestroy {
    private client: mqtt.MqttClient;
    private readonly MQTT_TOPIC = 'sensor/VibrationData';  // Define your MQTT topic here
    private readonly MQTT_HOST = 'mqtt://localhost:1883';  // MQTT broker host
    private bufferedData: any[] = []; // Buffer for storing data when offline
    
    onModuleInit() {
        const clientId = `mqtt_client_subscriber_${Math.random().toString(16).slice(2, 10)}`;
        // Initialize MQTT client and connect to broker with clean session false for persistence
        this.client = mqtt.connect(this.MQTT_HOST, {
            clientId,
            clean: false,  // Ensure persistent session for reconnections
            reconnectPeriod: 1000  // Retry every second
        });

        // Handle connection events
        this.client.on('connect', () => {
            console.log('MQTT Client Connected');
            // Publish buffered data when reconnected
            this.publishBufferedData();
        });

        // Handle disconnection events
        this.client.on('offline', () => {
            console.warn('MQTT Client went offline');
        });

        // Handle errors
        this.client.on('error', (error) => {
            console.error('MQTT Connection Error:', error);
        });

        // Handle reconnecting events
        this.client.on('reconnect', () => {
            console.log('MQTT Client Reconnecting');
        });
    }

    onModuleDestroy() {
        // Clean up the MQTT connection
        if (this.client) {
            this.client.end(true, () => {
                console.log('MQTT Client Disconnected');
            });
        }
    }

    constructor() {}

    private generateSensorData(id : string) {
        
        const ident = id;
        const temperature = +(Math.random() * 70 - 20).toFixed(2);  // Temperature between -20°C and 50°C
        const weight = +(Math.random() * 500).toFixed(2);  // Weight between 0 and 500kg
        const timestamp = Math.floor(Date.now() / 1000);  // Current timestamp in seconds
    
        return {
            
            ident,
            temperature,
            weight,
            timestamp
        };
    }
    
    sensorSimulator(id : string) {
        try {
            const sensorData = this.generateSensorData(id);
            const payload = JSON.stringify(sensorData);

            // Check if MQTT client is connected
            if (this.client && this.client.connected) {
                // Publish the sensor data to the MQTT topic with QoS level 2 and retain true
                this.client.publish(this.MQTT_TOPIC, payload, { qos: 2, retain: true }, (err) => {
                    if (err) {
                        console.error('Failed to publish sensor data:', err);
                    }
                });
            } else {
                // Buffer the data if the client is offline
                console.log('MQTT Client Offline, buffering data...');
                this.bufferedData.push(payload);
               
            }
        } catch (error) {
            console.error('Error in sensorSimulator:', error);
        }
    }

    // Publish buffered data when the client reconnects
    private publishBufferedData() {
        if (this.bufferedData.length > 0) {
            console.log(`Publishing ${this.bufferedData.length} buffered messages...`);
            while (this.bufferedData.length > 0) {
                const data = this.bufferedData.shift();
                this.client.publish(this.MQTT_TOPIC, data, { qos: 2, retain: true }, (err) => {
                    if (err) {
                        console.error('Failed to publish buffered data:', err);
                        // Re-buffer if failed
                        this.bufferedData.unshift(data);
                    }
                });
            }
        }
    }
}
