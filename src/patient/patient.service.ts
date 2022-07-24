import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AssignFileDto,
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
import admin from 'firebase-admin';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly doctorService: DoctorService,
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

  async subscribe(body: CreateSubscription, user: User) {
    const response = this.patientRepository
      .query(
        `insert into "patient_subscribes_doctor"("patientId", "doctorId")
             VALUES (${user.patient.id}, ${body.id})`,
      )
      .catch((reason) => {
        if (reason.code === '23505') {
          return this.patientRepository
            .query(
              `delete
                     from "patient_subscribes_doctor"
                     where "doctorId" = ${body.id}
                       and "patientId" = ${user.patient.id}`,
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

    const doctor = await this.doctorService.findOneDoctor(body.id, user);

    await admin.messaging().send({
      token: doctor.user.token,
      data: {
        notifee: JSON.stringify({
          title: 'Patient Subscribed',
          body: `${user.username} has subscribed to your profile`,
          android: {
            channelId: 'subscriptions',
          },
        }),
      },
    });

    return response;
  }

  async assignFile(assignFileDto: AssignFileDto, user: User) {
    const doctor = await this.doctorService.getAllSubscribed(user);

    const patient = doctor.subscribed.find(
      (value) => value.id === assignFileDto.patient,
    );

    if (patient === undefined) {
      throw new NotFoundException('Patient not found in subscription');
    }

    await admin.messaging().send({
      token: patient.user.token,
      data: {
        notifee: JSON.stringify({
          title: 'Assigned work',
          body: `${user.username} has assigned a work to your profile`,
          android: {
            channelId: 'general',
          },
        }),
      },
    });

    return this.fileRepository.save(
      this.fileRepository.create({
        ...assignFileDto,
        patient,
        assigned: true,
      }),
    );
  }
}
