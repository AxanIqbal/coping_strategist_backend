import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { FileEntity } from './entities/file.entity';
import { FavoriteController } from './favorite.controller';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, FileEntity]), DoctorModule],
  controllers: [PatientController, FavoriteController],
  providers: [PatientService],
})
export class PatientModule {}
