import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { SensorData } from 'src/entities/sensor.data.entity'; 
import { SensorGateway } from './sensor.gateway';


@Module({
  imports: [TypeOrmModule.forFeature([SensorData])], 
  providers: [SensorService , SensorGateway],
  controllers: [SensorController],
  exports: [SensorService],
})
export class SensorModule {}
