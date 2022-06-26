import { BaseEntity } from '../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ClinicAppointments } from '../../clinic/entities/clinic.appointments.entity';
import { Clinic } from '../../clinic/entities/clinic.entity';
import { User } from './user.entity';
import { IsEnum, IsInt, IsNumber } from 'class-validator';
import { FileEntity } from './file.entity';
import { Transform } from 'class-transformer';

enum Ethnicity {
  'Black' = 'Black',
  'African American' = 'African American',
  'Hispanic' = 'Hispanic',
  'Latino' = 'Latino',
}

@Entity()
export class Patient extends BaseEntity {
  @OneToMany(() => ClinicAppointments, (object) => object.patient)
  appointments: ClinicAppointments[];

  @ManyToMany(() => Clinic, { cascade: true })
  @JoinTable()
  favorites: Clinic[];

  @OneToOne(() => User, (object) => object.patient, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: Ethnicity })
  @IsEnum(Ethnicity)
  ethnicity: Ethnicity;

  @Column()
  @Transform((params) => Number(params.value))
  @IsNumber()
  age: number;

  @OneToMany(() => FileEntity, (object) => object.patient)
  files: FileEntity[];
}
