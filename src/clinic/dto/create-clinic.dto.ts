import { Clinic } from '../entities/clinic.entity';
import { IsLatitude, IsLongitude, IsNumber, IsPositive } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { ClinicAppointments } from '../entities/clinic.appointments.entity';

export class CreateClinicDto extends Clinic {
  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;
}

export class CreateAppointmentDto extends PickType(ClinicAppointments, [
  'date',
]) {
  @IsNumber()
  clinic: number;

  @IsNumber()
  doctor: number;
}
