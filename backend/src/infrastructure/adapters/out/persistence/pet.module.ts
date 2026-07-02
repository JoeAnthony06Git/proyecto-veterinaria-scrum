import { Module } from '@nestjs/common';
import { TutorController } from '../../in/http/tutor/TutorController';
import { PrismaMascotaRepository } from './repositories/PrismaPetRepository';
import { CreatePetUseCase } from '../../../../application/use-cases/pets/CreatePetUseCase';
import { GetPetsUseCase } from '../../../../application/use-cases/pets/GetPetsUseCase';
import { GetPetByIdUseCase } from '../../../../application/use-cases/pets/GetPetByIdUseCase';
import { UpdatePetUseCase } from '../../../../application/use-cases/pets/UpdatePetUseCase';
import { DeletePetUseCase } from '../../../../application/use-cases/pets/DeletePetUseCase';
import { AgendarCitaUseCase } from '../../../../application/use-cases/scheduling/ScheduleAppointmentUseCase';
import { ObtenerCitasUseCase } from '../../../../application/use-cases/scheduling/GetAppointmentsUseCase';
import { PrismaRepositorioCita } from './repositories/PrismaAppointmentRepository';

@Module({
  controllers: [TutorController],
  providers: [
    PrismaMascotaRepository,
    PrismaRepositorioCita,
    CreatePetUseCase,
    GetPetsUseCase,
    GetPetByIdUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    AgendarCitaUseCase,
    ObtenerCitasUseCase,
  ],
  exports: [PrismaMascotaRepository, PrismaRepositorioCita],
})
export class PetModule {}