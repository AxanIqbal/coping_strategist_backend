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
