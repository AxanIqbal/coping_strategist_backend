import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';
import { DoctorEntity } from '../../user/entities/doctor.entity';
import { Type } from 'class-transformer';

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

  @IsUrl()
  profileUrl: string;

  @Type(() => DoctorEntity)
  @ValidateNested()
  doctor?: DoctorEntity;
}
