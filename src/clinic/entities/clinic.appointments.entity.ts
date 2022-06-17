import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsDate } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Clinic } from './clinic.entity';

@Entity()
export class ClinicAppointments extends BaseEntity {
  @Column()
  @IsDate()
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  patient: User;

  @ManyToOne(() => Clinic, { onDelete: 'CASCADE' })
  clinic: Clinic;
}
