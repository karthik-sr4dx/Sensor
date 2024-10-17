import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorModule } from './sensor/sensor.module';
// import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config'; 
import { SensorSimulatorModule } from './sensor-simulator/sensor-simulator.module';
import { CronModule } from './cron/cron.module';



@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),  // Check if 'typeorm' is properly defined
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),
    SensorModule,
    SensorSimulatorModule,
    CronModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
