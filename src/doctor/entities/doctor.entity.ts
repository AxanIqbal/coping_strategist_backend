import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsDate, IsString, ValidateNested } from 'class-validator';
import { Clinic } from '../../clinic/entities/clinic.entity';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { ClinicAppointments } from '../../clinic/entities/clinic.appointments.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Licence } from './licence.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity()
export class Doctor extends BaseEntity {
  @OneToOne(() => User, (object) => object.doctor, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Clinic, (object) => object.doctors, { nullable: true })
  @JoinColumn()
  clinic: Clinic;

  @ManyToMany(() => Patient, (object) => object.subscribes)
  subscribed: Patient[];

  @Column()
  @IsString()
  profession: string;

  @OneToMany(() => ClinicAppointments, (object) => object.doctor)
  appointments: ClinicAppointments[];

  @Column()
  @IsString()
  about: string;

  @OneToOne(() => Licence, (object) => object.doctor, { cascade: true })
  @Type(() => Licence)
  @ValidateNested()
  licence: Licence;

  @Column('boolean', { default: false })
  is_verified: boolean;

  subscribe: boolean;
}
