import { Clinic } from '../entities/clinic.entity';
import { IsLatitude, IsLongitude } from 'class-validator';

export class CreateClinicDto extends Clinic {
  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;
}
