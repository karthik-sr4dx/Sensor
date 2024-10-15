import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SensorData } from 'src/entities/sensor.data.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'sensor',
  entities: [
    SensorData
  ],
  synchronize: true,
});