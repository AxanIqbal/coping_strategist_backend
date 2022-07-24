import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePatientDto {}

export class CreateFileDto {
  @IsString()
  name: string;
}

export class CreateSubscription {
  @IsPositive()
  id: number;
}

export class AssignFileDto {
  @IsString()
  name: string;

  @IsString()
  file: string;

  @IsNumber()
  patient: number;
}
