import { Module } from '@nestjs/common';


@Module({
  imports: [], // Import the module that provides SensorService
  providers: [], // Add SensorGateway as a provider
})
export class GatewayModule {}
