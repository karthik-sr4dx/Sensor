import { Controller, Get, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ApiTags, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { SensorData } from 'src/entities/sensor.data.entity'; 

@ApiTags('sensors')  // Swagger Tag for the Sensors API
@Controller('/v1/sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('/getData')
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Limit the number of records returned' 
  })
  @ApiOkResponse({
    status: 200,
    description: 'Successful response', 
    type: [SensorData] // Define the return type (array of SensorData)
  })
  async getData(@Query('limit') limit?: number) {
    return await this.sensorService.getData(limit);
  }
}
