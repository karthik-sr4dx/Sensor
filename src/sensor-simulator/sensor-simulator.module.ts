import { Module } from '@nestjs/common';
import { SensorSimulatorController } from './sensor-simulator.controller';
import { SensorSimulatorService } from './sensor-simulator.service';

@Module({
  controllers: [SensorSimulatorController],
  providers: [SensorSimulatorService]
})
export class SensorSimulatorModule {}
