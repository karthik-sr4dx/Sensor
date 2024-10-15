import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SensorSimulatorService } from 'src/sensor-simulator/sensor-simulator.service';

@Controller('cron')
export class CronController {
  constructor(
    private readonly sensorSimulatorService: SensorSimulatorService
  ) {}

  // This cron job will run every second
  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    const sensorIds = [
      'sensor_5746',
      'sensor_4958',
      'sensor_9532',
      'sensor_8661',
      'sensor_5217'
    ];

    // Loop over each sensor ID and simulate the data
    sensorIds.forEach((sensorId) => {
      try {
        this.sensorSimulatorService.sensorSimulator(sensorId);
      } catch (error) {
        console.error(`Error simulating data for ${sensorId}:`, error);
      }
    });
  }
}
