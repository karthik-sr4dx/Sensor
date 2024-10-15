import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { SensorData } from 'src/entities/sensor.data.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])], 
  providers: [SensorService],
  controllers: [SensorController],
})
export class SensorModule {}
