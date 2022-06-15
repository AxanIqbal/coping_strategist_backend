import {
  Column,
  Index,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Point } from 'geojson';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
}

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

  @OneToOne(() => ClinicTimings, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ClinicTimings)
  timings: ClinicTimings;
}
