import { forwardRef, Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorService } from 'src/sensor/sensor.service';


@WebSocketGateway({
  cors: {
    origin: '*',  // Allow cross-origin requests (adjust this as necessary)
  },
})
export class SensorGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => SensorService)) 
    private readonly sensorService: SensorService,
  
  ) {}

  // Handle new client connection
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnect
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Send updated sensor data to the client in real time
  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('subscribeToSensorData')
  async handleSensorData(client: Socket, payload: { limit?: number; startDate?: string; endDate?: string }) {
    // Fetch the sensor data using the service
    const data = await this.sensorService.getData(payload.limit, payload.startDate, payload.endDate);
    client.emit('sensorDataUpdate', data);
  }

  // Broadcast data to all connected clients
  sendSensorDataUpdate(data: any) {
    this.server.emit('sensorDataUpdate', data); // Broadcast data to all clients
  }
}
