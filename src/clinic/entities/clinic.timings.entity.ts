import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Clinic } from './clinic.entity';

@Entity()
export class ClinicTimings {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => Clinic, (object) => object.timings, { onDelete: 'CASCADE' })
  clinic: Clinic;
}
