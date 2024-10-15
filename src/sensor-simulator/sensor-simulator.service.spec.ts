import { Test, TestingModule } from '@nestjs/testing';
import { SensorSimulatorService } from './sensor-simulator.service';

describe('SensorSimulatorService', () => {
  let service: SensorSimulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorSimulatorService],
    }).compile();

    service = module.get<SensorSimulatorService>(SensorSimulatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
