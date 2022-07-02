import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorEntityRepository: Repository<Doctor>,
  ) {}
  findOneDoctor(id: number) {
    return this.doctorEntityRepository.findOne({
      where: { id },
      relations: ['appointments', 'user'],
    });
  }

  getAll() {
    return this.doctorEntityRepository.find({
      where: { is_verified: true },
      relations: ['user'],
    });
  }
}
