import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsUrl } from 'class-validator';
import { Clinic } from './clinic.entity';

@Entity()
export class ClinicPicturesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsUrl()
  url: string;

  @ManyToOne(() => Clinic, (object) => object.pictures)
  clinic: Clinic;
}
