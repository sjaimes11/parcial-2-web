import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['medicos', 'diagnosticos'] });
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['medicos', 'diagnosticos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'El paciente con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return paciente;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (!paciente.nombre || paciente.nombre.trim().length < 3)
      throw new BusinessLogicException(
        'El nombre del paciente debe tener al menos 3 caracteres',
        BusinessError.BAD_REQUEST,
      );

    return await this.pacienteRepository.save(paciente);
  }

  async delete(id: string) {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'El paciente con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (paciente.diagnosticos && paciente.diagnosticos.length > 0)
      throw new BusinessLogicException(
        'No se puede eliminar un paciente que tiene diagnósticos asociados',
        BusinessError.PRECONDITION_FAILED,
      );

    await this.pacienteRepository.remove(paciente);
  }
}