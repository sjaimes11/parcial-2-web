import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let diagnosticoList: DiagnosticoEntity[] = [];
  let pacienteList: PacienteEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticoRepository.clear();

    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.fullName(),
        genero: faker.person.gender(),
      });
      pacienteList.push(paciente);
    }

    diagnosticoList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        pacientes: [],
      });
      diagnosticoList.push(diagnostico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes.length).toBe(pacienteList.length);
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacienteList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toBe(storedPaciente.nombre);
    expect(paciente.genero).toBe(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid paciente', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no fue encontrado',
    );
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      diagnosticos: [],
      medicos: [],
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente = await repository.findOne({
      where: { id: newPaciente.id },
    });

    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toBe(paciente.nombre);
    expect(storedPaciente.genero).toBe(paciente.genero);
  });

  it('create should throw an exception for a paciente with a name with less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'jo',
      genero: faker.person.gender(),
      diagnosticos: [],
      medicos: [],
    };

    await expect(service.create(paciente)).rejects.toHaveProperty(
      'message',
      'El nombre del paciente debe tener al menos 3 caracteres',
    );
  });

  it('delete should remove a paciente', async () => {
    const storedPaciente: PacienteEntity = pacienteList[0];
    await service.delete(storedPaciente.id);
    const deletedPaciente = await repository.findOne({
      where: { id: storedPaciente.id },
    });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no fue encontrado',
    );
  });

  it('delete should throw an exception for a paciente with diagnosticos', async () => {
    const storedPaciente: PacienteEntity = pacienteList[0];
    const paciente = await service.findOne(storedPaciente.id);
    paciente.diagnosticos = diagnosticoList;
    await repository.save(paciente);

    await expect(service.delete(storedPaciente.id)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un paciente con diagnósticos asociados',
    );
  });
});