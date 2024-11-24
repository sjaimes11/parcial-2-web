import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicoList: MedicoEntity[] = [];
  let pacienteList: PacienteEntity[] = [];
  let pacienteRepository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacienteRepository.clear();
    medicoList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
      });
      medicoList.push(medico);
    }

    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.fullName(),
        genero: faker.person.gender(),
      });
      pacienteList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos.length).toBe(medicoList.length);
  });

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicoList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toBe(storedMedico.nombre);
    expect(medico.especialidad).toBe(storedMedico.especialidad);
    expect(medico.telefono).toBe(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid medico', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The doctor with the given id was not found',
    );
  });

  it('create should create a new medico', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    };

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({
      where: { id: newMedico.id },
    });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toBe(medico.nombre);
    expect(storedMedico.especialidad).toBe(medico.especialidad);
    expect(storedMedico.telefono).toBe(medico.telefono);
  });

  it('create should throw an exception if nombre is null', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: [],
    };

    await expect(service.create(medico)).rejects.toHaveProperty(
      'message',
      'The name must not be empty',
    );
  });

  it('create should throw an exception if especialidad is null', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: '',
      telefono: faker.phone.number(),
      pacientes: [],
    };

    await expect(service.create(medico)).rejects.toHaveProperty(
      'message',
      'The specialty must not be empty',
    );
  });

  it('delete should remove a medico', async () => {
    const storedMedico: MedicoEntity = medicoList[0];
    await service.delete(storedMedico.id);
    const medico: MedicoEntity = await repository.findOne({
      where: { id: storedMedico.id },
    });
    expect(medico).toBeNull();
  });

  it('delete should throw an exception for an invalid medico', async () => {
    const medico: MedicoEntity = medicoList[0];
    await service.delete(medico.id);
    await expect(service.delete(medico.id)).rejects.toHaveProperty(
      'message',
      'The doctor with the given id was not found',
    );
  });

  it('delete should throw an exception for a medico with associated pacientes', async () => {
    const storedMedico: MedicoEntity = medicoList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    medico.pacientes = pacienteList;
    await repository.save(medico);
    await expect(service.delete(storedMedico.id)).rejects.toHaveProperty(
      'message',
      'The doctor cannot be deleted because it has associated patients',
    );
  });
});