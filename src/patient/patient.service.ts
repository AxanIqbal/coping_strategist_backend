import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import {
  CreateFileDto,
  CreatePatientDto,
  CreateSubscription,
} from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateFavDto } from '../user/dto/create-fav.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient ' + createPatientDto;
  }

  createFile(
    createPatientDto: CreateFileDto,
    file: Express.Multer.File,
    user: User,
  ) {
    const patient = user.patient;
    delete user.patient;
    patient.user = user;
    return this.fileRepository.save(
      this.fileRepository.create({
        file,
        name: createPatientDto.name,
        patient,
      }),
    );
  }

  getAllFiles(user: User) {
    return this.fileRepository.find({
      where: { patient: { id: user.patient.id } },
    });
  }

  findAll() {
    return `This action returns all patient`;
  }

  findOne(id: number, user: User) {
    return this.patientRepository.findOne({
      where: { subscribes: { id: user.doctor.id } },
      relations: ['files'],
    });
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient ${updatePatientDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }

  async addFav(user: User, favId: CreateFavDto) {
    return this.patientRepository
      .query(
        `insert into "patient_favorites_clinic"("patientId", "clinicId") VALUES (${user.patient.id}, ${favId.id})`,
      )
      .catch((reason) => {
        if (reason.code === '23505') {
          throw new ConflictException('Already Exists');
        }
        if (reason.code === '23503') {
          throw new HttpException('Favorite Not Found', 404);
        }
      });
  }

  removeFav(user: User, favId: CreateFavDto) {
    // const favorites = user.favorites.filter((value) => value.id === favId.id);
    return this.patientRepository
      .query(
        `delete from "patient_favorites_clinic" where "clinicId"=${favId.id} and "patientId"=${user.patient.id}`,
      )
      .catch((reason) => {
        if (reason.code === '23505') {
          throw new ConflictException('Already Exists');
        }
        if (reason.code === '23503') {
          throw new HttpException('Favorite Not Found', 404);
        }
      });
  }

  getAllFav(user: User) {
    return this.patientRepository.find({
      where: { id: user.patient.id },
      relations: ['favorites'],
    });
  }

  subscribe(body: CreateSubscription, user: User) {
    return this.patientRepository
      .query(
        `insert into "patient_subscribes_doctor"("patientId", "doctorId") VALUES (${user.patient.id}, ${body.id})`,
      )
      .catch((reason) => {
        if (reason.code === '23505') {
          return this.patientRepository
            .query(
              `delete from "patient_subscribes_doctor" where "doctorId"=${body.id} and "patientId"=${user.patient.id}`,
            )
            .catch((reason) => {
              if (reason.code === '23505') {
                throw new ConflictException('Already Exists');
              }
              if (reason.code === '23503') {
                throw new HttpException('Subscription Not Found', 404);
              }
            });
        }
        if (reason.code === '23503') {
          throw new HttpException('Subscription Not Found', 404);
        }
      });
  }
}
