import { Test, TestingModule } from '@nestjs/testing';
import { SensorSimulatorController } from './sensor-simulator.controller';

describe('SensorSimulatorController', () => {
  let controller: SensorSimulatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorSimulatorController],
    }).compile();

    controller = module.get<SensorSimulatorController>(SensorSimulatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
