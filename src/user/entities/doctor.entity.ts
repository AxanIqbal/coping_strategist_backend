import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsDate, IsString } from 'class-validator';
import { Clinic } from '../../clinic/entities/clinic.entity';
import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { ClinicAppointments } from '../../clinic/entities/clinic.appointments.entity';

@Entity()
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (object) => object.doctor, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Clinic, (object) => object.doctors)
  @JoinColumn()
  clinic: Clinic;

  @Column()
  @Transform((date) => moment(date.value, 'hh:mm A').toDate())
  @IsDate()
  timeFrom: Date;

  @Column()
  @IsDate()
  @Transform((date) => moment(date.value, 'hh:mm A').toDate())
  timeTo: Date;

  @Column()
  @IsString()
  profession: string;

  @OneToMany(() => ClinicAppointments, (object) => object.doctor)
  appointments: ClinicAppointments[];
}
