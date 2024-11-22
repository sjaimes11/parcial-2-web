import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe crear un paciente correctamente', async () => {
    const paciente = {
      nombre: 'Juan Pérez',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: [],
    };

    jest.spyOn(repository, 'save').mockResolvedValue({
      id: 'some-uuid',
      ...paciente,
    });

    const result = await service.create(paciente as PacienteEntity);

    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(paciente.nombre);
    expect(result.genero).toEqual(paciente.genero);
  });

  it('debe lanzar una excepción al crear un paciente con nombre de menos de tres caracteres', async () => {
    const paciente = {
      nombre: 'Jo', // Menos de 3 caracteres
      genero: 'Femenino',
      medicos: [],
      diagnosticos: [],
    };

    await expect(service.create(paciente as PacienteEntity)).rejects.toThrow(
      new BusinessLogicException('Nombre debe tener al menos tres caracteres', 400),
    );
  });
});
