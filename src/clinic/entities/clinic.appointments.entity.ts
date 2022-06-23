import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate, IsDateString, IsString, Validate } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Clinic } from './clinic.entity';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { DoctorEntity } from '../../user/entities/doctor.entity';

@Entity()
export class ClinicAppointments extends BaseEntity {
  @Column()
  @Transform((date) => moment(date.value, 'YYYY-MM-DD hh:mm A').toDate())
  @IsDate()
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  patient: User;

  @ManyToOne(() => DoctorEntity, (object) => object.appointments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  doctor: DoctorEntity;

  @ManyToOne(() => Clinic, { onDelete: 'CASCADE', nullable: false })
  clinic: Clinic;
}
