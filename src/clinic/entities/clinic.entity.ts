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
import { Expose, Type } from 'class-transformer';
import { ClinicTimings } from './clinic.timings.entity';
import { ClinicPicturesEntity } from './clinic.pictures.entity';

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
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ClinicTimings)
  timings: ClinicTimings;

  @OneToMany(() => ClinicPicturesEntity, (object) => object.clinic, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  @ValidateNested({ each: true })
  @Type(() => Array<ClinicPicturesEntity>)
  pictures: ClinicPicturesEntity[];

  distance?: number;
}
