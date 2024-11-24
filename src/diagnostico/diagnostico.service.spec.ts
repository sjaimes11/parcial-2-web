/* src/diagnostico/diagnostico.service.spec.ts */
import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticoList: DiagnosticoEntity[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    diagnosticoList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        pacientes: [],
      });
      diagnosticoList.push(diagnostico);
    }
  };

  afterEach(async () => {
    await repository.clear();
    await seedDatabase();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los diagnósticos', async () => {
      const diagnosticos: DiagnosticoEntity[] = await service.findAll();
      expect(diagnosticos).not.toBeNull();
      expect(diagnosticos).toHaveLength(diagnosticoList.length);
    });
  });

  describe('findOne', () => {
    it('debe retornar un diagnóstico por id', async () => {
      const storedDiagnostico: DiagnosticoEntity = diagnosticoList[0];
      const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
      expect(diagnostico).not.toBeNull();
      expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
      expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
    });

    it('debe lanzar una excepción al no encontrar un diagnóstico', async () => {
      const invalidId = '0';
     
      await expect(service.findOne(invalidId)).rejects.toHaveProperty(
        'message',
        'The diagnosis with the given id was not found',
      );
    });
  });

  describe('create', () => {
    it('debe crear un nuevo diagnóstico', async () => {
      const diagnostico: DiagnosticoEntity = {
        id: '',
        nombre: faker.lorem.word(),
        descripcion: 'Descripción válida',
        pacientes: [],
      };

      const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
      expect(newDiagnostico).not.toBeNull();

      const storedDiagnostico = await repository.findOne({ where: { id: newDiagnostico.id } });
      expect(storedDiagnostico).not.toBeNull();
      expect(storedDiagnostico.nombre).toEqual(diagnostico.nombre);
      expect(storedDiagnostico.descripcion).toEqual(diagnostico.descripcion);
    });

    it('debe lanzar una excepción si la descripción excede los 200 caracteres', async () => {
      const diagnostico: DiagnosticoEntity = {
        id: '',
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.paragraphs(10), // Genera una descripción larga
        pacientes: [],
      };

      
      await expect(service.create(diagnostico)).rejects.toHaveProperty(
        'message',
        'The description must not exceed 200 characters',
      );
    });
  });

  describe('delete', () => {
    it('debe eliminar un diagnóstico existente', async () => {
      const diagnostico: DiagnosticoEntity = diagnosticoList[0];
      await service.delete(diagnostico.id);

      const deletedDiagnostico = await repository.findOne({ where: { id: diagnostico.id } });
      expect(deletedDiagnostico).toBeNull();
    });

    it('debe lanzar una excepción al intentar eliminar un diagnóstico inexistente', async () => {
      const diagnostico: DiagnosticoEntity = diagnosticoList[0];
      await service.delete(diagnostico.id);
      await expect(service.delete(diagnostico.id)).rejects.toHaveProperty(
        'message',
        'The diagnosis with the given id was not found',
      );
    });
  });
});
