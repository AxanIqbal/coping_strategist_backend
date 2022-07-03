import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import admin from 'firebase-admin';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Merchant } from './merchant.entity';

export enum UserRole {
  client = 'client',
  admin = 'admin',
  merchant = 'merchant',
  doctor = 'doctor',
}

@Entity()
export class User extends BaseEntity {
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

  @Column({ default: 'None' })
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'varchar' })
  @IsUrl()
  profileUrl: string | Express.Multer.File;

  @OneToOne(() => Doctor, (object) => object.user, { cascade: true })
  @Type(() => Doctor)
  @ValidateNested()
  doctor?: Doctor;

  @OneToOne(() => Patient, (object) => object.user, { cascade: true })
  @Type(() => Patient)
  @ValidateNested()
  patient?: Patient;

  @OneToOne(() => Merchant, (object) => object.user, { cascade: true })
  @Type(() => Merchant)
  @ValidateNested()
  merchant: Merchant;

  @Column({ nullable: true })
  @Allow()
  token?: string;

  @Column({ nullable: true })
  @Allow()
  country?: string;

  @Column({ nullable: true })
  @Allow()
  province?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (typeof this.profileUrl !== 'string') {
      const bucket = admin
        .storage()
        .bucket()
        .file(`profiles/${this.username}/profile.png`);
      await bucket.save(this.profileUrl.buffer);
      await bucket.makePublic();
      this.profileUrl = bucket.publicUrl();
    }
  }

  @BeforeRemove()
  async removePicture(): Promise<void> {
    await admin
      .storage()
      .bucket()
      .file(`profiles/${this.username}/profile.png`)
      .delete({ ignoreNotFound: true });
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
