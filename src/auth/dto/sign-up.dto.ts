import {
  Allow,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';
import { DoctorEntity } from '../../user/entities/doctor.entity';
import { Transform, Type } from 'class-transformer';
import { Patient } from '../../user/entities/patient.entity';

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

  @Type(() => DoctorEntity)
  @ValidateNested()
  doctor?: DoctorEntity;

  @Type(() => Patient)
  @ValidateNested()
  patient?: Patient;

  profileUrl: Express.Multer.File;

  token?: string;
}
