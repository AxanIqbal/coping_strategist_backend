import { BaseEntity } from '../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ClinicAppointments } from '../../clinic/entities/clinic.appointments.entity';
import { Clinic } from '../../clinic/entities/clinic.entity';
import { Allow, IsEnum, IsNumber } from 'class-validator';
import { FileEntity } from './file.entity';
import { Transform } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';

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

  @ManyToMany(() => Doctor, (object) => object.subscribed)
  @JoinTable()
  @Allow()
  subscribes: Doctor[];

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
