import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate, IsDateString, IsString, Validate } from 'class-validator';
import { Clinic } from './clinic.entity';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { DoctorEntity } from '../../user/entities/doctor.entity';
import { Patient } from '../../user/entities/patient.entity';

@Entity()
export class ClinicAppointments extends BaseEntity {
  @Column()
  @Transform((date) => moment(date.value, 'YYYY-MM-DD hh:mm A').toDate())
  @IsDate()
  date: Date;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE', nullable: false })
  patient: Patient;

  @ManyToOne(() => DoctorEntity, (object) => object.appointments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  doctor: DoctorEntity;

  @ManyToOne(() => Clinic, { nullable: true })
  clinic: Clinic;
}
