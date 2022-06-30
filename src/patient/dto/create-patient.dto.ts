import { IsString } from 'class-validator';

export class CreatePatientDto {}

export class CreateFileDto {
  @IsString()
  name: string;
}
