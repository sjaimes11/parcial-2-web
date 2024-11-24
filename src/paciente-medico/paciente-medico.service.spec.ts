import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    medicoRepository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();

    paciente = await pacienteRepository.save({
      nombre: 'roberto',
      genero: 'Masculino',
    });

    medicosList = [];
    for (let i = 1; i < 6; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: `Medico ${i}`,
        especialidad: 'Especialidad',
        telefono: '302555555', 
            });
      medicosList.push(medico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medico to a paciente', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: 'Santiago',
      genero: 'Masculino',
    });


    const newMedico = await medicoRepository.save({
      nombre: 'ana',
      especialidad: 'Especialidad',
      telefono: '302555555',
    });

    const result = await service.addMedicoToPaciente(
      newPaciente.id,
      newMedico.id,
    );

    expect(result).not.toBeNull();
    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0].nombre).toBe(newMedico.nombre);
    expect(result.medicos[0].especialidad).toBe(newMedico.especialidad);
    expect(result.medicos[0].telefono).toBe(newMedico.telefono);
  });

  it('addMedicoToPaciente should throw an exception for an invalid paciente', async () => {
    await expect(
      service.addMedicoToPaciente('0', medicosList[0].id),
    ).rejects.toHaveProperty('message', 'El paciente con el id dado no fue encontrado');
  });

  it('addMedicoToPaciente should throw an exception for an invalid medico', async () => {
    await expect(
      service.addMedicoToPaciente(paciente.id, '0'),
    ).rejects.toHaveProperty('message', 'The doctor with the given id was not found');
  });

  it('addMedicoToPaciente should throw an exception if add a new medico to a paciente with 5 medicos', async () => {
    for (let i = 0; i < 5; i++) {
      await service.addMedicoToPaciente(paciente.id, medicosList[i].id);
    }

    const newMedico = await medicoRepository.save({
      nombre: 'ana',
      especialidad: 'Especialidad',
      telefono: '302555555',
    });

    await expect(
      service.addMedicoToPaciente(paciente.id, newMedico.id),
    ).rejects.toHaveProperty(
      'message',
      'The patient cannot have more than 5 doctors assigned',
    );
  });
});