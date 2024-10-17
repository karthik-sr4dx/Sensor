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
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    type: String, 
    description: 'Start date for filtering records (in YYYY-MM-DD format)' 
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    type: String, 
    description: 'End date for filtering records (in YYYY-MM-DD format)' 
  })
  @ApiOkResponse({
    status: 200,
    description: 'Successful response', 
    type: [SensorData] // Define the return type (array of SensorData)
  })
  async getData(
    @Query('limit') limit?: number, 
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string
  ) {
    return await this.sensorService.getData(limit, startDate, endDate);
  }

}
