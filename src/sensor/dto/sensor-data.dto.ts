// src/dto/sensor-data.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDto {
  @ApiProperty({
    description: 'Unique identifier for the sensor',
    type: String,
  })
  ident: string;

  @ApiProperty({
    description: 'Temperature measured by the sensor',
    type: Number,
    example: 25.5, // Example value
  })
  temperature: number; // Keep temperature as it's required

  @ApiProperty({
    description: 'Timestamp of when the data was recorded',
    type: String,
    example: '2024-10-15T12:00:00Z', // Example value
  })
  timestamp: string; // Keep timestamp as it's required

  @ApiProperty({
    description: 'Weight measured by the sensor',
    type: Number,
    example: 100.0, // Example value
  })
  weight: number; // Add weight property as it's required
}
