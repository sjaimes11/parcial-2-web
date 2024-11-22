import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
