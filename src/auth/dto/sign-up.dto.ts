import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Type } from 'class-transformer';
import { Patient } from '../../patient/entities/patient.entity';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  readonly username: string;

  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsEnum(UserRole)
  readonly role: UserRole;

  @Type(() => Doctor)
  @ValidateNested()
  doctor?: Doctor;

  @Type(() => Patient)
  @ValidateNested()
  patient?: Patient;

  profileUrl: Express.Multer.File;

  token?: string;
}
