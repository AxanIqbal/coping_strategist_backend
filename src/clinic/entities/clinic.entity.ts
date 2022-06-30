import {
  Column,
  Index,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Point } from 'geojson';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClinicPicturesEntity } from './clinic.pictures.entity';
import { ClinicAppointments } from './clinic.appointments.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: Point;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  details: string;

  @OneToMany(() => Doctor, (object) => object.clinic)
  doctors: Doctor[];

  // @OneToOne(() => ClinicTimings, (object) => object.clinic, {
  //   cascade: true,
  // })
  // @ValidateNested()
  // @IsNotEmpty()
  // @Type(() => ClinicTimings)
  // timings: ClinicTimings;

  @OneToMany(() => ClinicPicturesEntity, (object) => object.clinic, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @ValidateNested({ each: true })
  @Type(() => Array<ClinicPicturesEntity>)
  pictures: ClinicPicturesEntity[];

  @OneToMany(() => ClinicAppointments, (object) => object.clinic)
  appointments: ClinicAppointments[];

  distance?: number;
}
