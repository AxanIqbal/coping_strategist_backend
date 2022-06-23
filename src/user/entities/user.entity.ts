import {
  AfterRemove,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import admin from 'firebase-admin';
import { ClinicAppointments } from '../../clinic/entities/clinic.appointments.entity';
import { Clinic } from '../../clinic/entities/clinic.entity';
import { DoctorEntity } from './doctor.entity';

export enum UserRole {
  client = 'client',
  admin = 'admin',
  merchant = 'merchant',
  doctor = 'doctor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @IsString()
  username: string;

  @Column()
  @IsString()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  @IsUrl()
  profileUrl: string;

  @OneToMany(() => ClinicAppointments, (object) => object.patient)
  appointments: ClinicAppointments[];

  @ManyToMany(() => Clinic, { cascade: true })
  @JoinTable()
  favorites: Clinic[];

  @OneToOne(() => DoctorEntity, (object) => object.user, { cascade: true })
  @ValidateNested()
  doctor?: DoctorEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @AfterRemove()
  async removePicture(): Promise<void> {
    await admin.storage().bucket().file(`profiles/${this.username}`).delete();
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
