import { Injectable } from '@nestjs/common';
import { CreateFileDto, CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
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
    return this.fileRepository.find({ where: { patient: !user.patient } });
  }

  findAll() {
    return `This action returns all patient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient ${updatePatientDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
