import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { SensorSimulatorService } from 'src/sensor-simulator/sensor-simulator.service';

@Module({
  controllers: [CronController],
  providers : [SensorSimulatorService]
})
export class CronModule {}
