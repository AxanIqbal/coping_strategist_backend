import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Licence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Transform((params) => Number(params.value))
  @IsNumber()
  number: number;

  @Column()
  @IsString()
  state: string;

  @OneToOne(() => DoctorEntity, (object) => object.licence, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  doctor: DoctorEntity;
}
