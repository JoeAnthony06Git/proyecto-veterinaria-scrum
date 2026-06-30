import { Module } from '@nestjs/common';

import { TutorController } from '../../in/http/tutor/TutorController';

import { PrismaMascotaRepository } from './repositories/PrismaPetRepository';

@Module({
  controllers: [TutorController],
  providers: [
    PrismaMascotaRepository, 
  ],
  exports: [PrismaMascotaRepository], 
})
export class PetModule {}