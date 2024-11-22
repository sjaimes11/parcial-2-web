import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    // Verificar que el paciente exista
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'The patient with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Verificar que el médico exista
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException(
        'The doctor with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Validar que el paciente no tenga más de 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException(
        'The patient cannot have more than 5 doctors assigned',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Asignar el médico al paciente
    paciente.medicos.push(medico);
    return await this.pacienteRepository.save(paciente);
  }
}