import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate, IsDateString, IsString, Validate } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Clinic } from './clinic.entity';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';

@Entity()
export class ClinicAppointments extends BaseEntity {
  @Column()
  @Transform((date) => moment(date.value, 'YYY-MM-DD hh:mm A').toDate())
  @IsDate()
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  patient: User;

  @ManyToOne(() => Clinic, { onDelete: 'CASCADE', nullable: false })
  clinic: Clinic;
}
