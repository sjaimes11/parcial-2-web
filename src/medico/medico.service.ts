import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}


  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find();
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });

    if (!medico) {
      throw new BusinessLogicException(
        'The doctor with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return medico;
  }

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (medico.nombre === '') {
      throw new BusinessLogicException(
        'The name must not be empty',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (medico.especialidad === '') {
      throw new BusinessLogicException(
        'The specialty must not be empty',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return this.medicoRepository.save(medico);
  }

  async delete(id: string): Promise<void> {
    const medico = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new BusinessLogicException(
        'The doctor with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (medico.pacientes.length > 0) {
      throw new BusinessLogicException(
        'The doctor cannot be deleted because it has associated patients',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    await this.medicoRepository.delete(medico.id);
  }
}