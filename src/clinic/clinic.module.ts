import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicTimings } from './entities/clinic.timings.entity';
import { ClinicPicturesEntity } from './entities/clinic.pictures.entity';
import { ClinicAppointments } from './entities/clinic.appointments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicTimings,
      ClinicPicturesEntity,
      ClinicAppointments,
      Clinic,
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}
