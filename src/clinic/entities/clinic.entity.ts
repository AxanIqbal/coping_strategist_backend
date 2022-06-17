import {
  Column,
  Index,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Point } from 'geojson';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClinicTimings } from './clinic.timings.entity';
import { ClinicPicturesEntity } from './clinic.pictures.entity';
import { ClinicAppointments } from './clinic.appointments.entity';

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

  @OneToOne(() => ClinicTimings, (object) => object.clinic, {
    cascade: true,
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ClinicTimings)
  timings: ClinicTimings;

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
