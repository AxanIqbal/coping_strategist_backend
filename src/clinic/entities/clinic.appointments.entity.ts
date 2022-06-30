import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate } from 'class-validator';
import { Clinic } from './clinic.entity';
import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity()
export class ClinicAppointments extends BaseEntity {
  @Column()
  @Transform((date) => moment(date.value, 'YYYY-MM-DD hh:mm A').toDate())
  @IsDate()
  date: Date;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE', nullable: false })
  patient: Patient;

  @ManyToOne(() => Doctor, (object) => object.appointments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  doctor: Doctor;

  @ManyToOne(() => Clinic, { nullable: true })
  clinic: Clinic;
}
