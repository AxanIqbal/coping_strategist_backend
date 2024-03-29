import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  InsertEvent,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IsBoolean, IsString, IsUrl } from 'class-validator';
import admin from 'firebase-admin';
import { Patient } from './patient.entity';

@Entity()
export class FileEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  @IsUrl()
  file: string | Express.Multer.File;

  @Column()
  @IsString()
  name: string;

  @ManyToOne(() => Patient, (object) => object.files, { onDelete: 'CASCADE' })
  @JoinColumn()
  patient: Patient;

  @Column('bool', { default: false })
  @IsBoolean()
  assigned: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async uploadImage() {
    if (typeof this.file !== 'string') {
      const bucket = admin
        .storage()
        .bucket()
        .file(
          `profiles/${this.patient.user.username}/${
            Date.now() + '-' + this.name
          }`,
        );
      await bucket.save(this.file.buffer);
      await bucket.makePublic();
      this.file = bucket.publicUrl();
    }
  }

  @BeforeRemove()
  async removeFile() {
    if (!this.assigned) {
      const bucket = admin
        .storage()
        .bucket()
        .file(
          `profiles/${this.patient.user.username}/${
            this.createdAt + '-' + this.name
          }`,
        );
      await bucket.delete({ ignoreNotFound: true });
    }
  }
}
