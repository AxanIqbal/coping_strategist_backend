import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDate, IsDateString, IsString } from 'class-validator';
import { Clinic } from './clinic.entity';

@Entity()
export class ClinicTimings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Clinic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  clinic: Clinic;

  @Column()
  @IsString()
  monday: string;

  @Column()
  @IsString()
  tuesday: string;

  @Column()
  @IsString()
  wednesday: string;

  @Column()
  @IsString()
  thursday: string;

  @Column()
  @IsString()
  friday: string;
}
