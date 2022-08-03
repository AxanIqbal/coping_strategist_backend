import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorEntityRepository: Repository<Doctor>,
  ) {}
  async findOneDoctor(id: number, user: User) {
    const doctor = await this.doctorEntityRepository.findOne({
      where: { id },
      relations: ['appointments', 'user', 'subscribed'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor Not Found');
    }

    if (user.role === UserRole.client) {
      doctor.subscribe = !!doctor?.subscribed.find(
        (value) => value.id === user.patient.id,
      );
    }
    delete doctor.subscribed;
    return doctor;
  }

  getAll(search: string) {
    if (search) {
      const formattedQuery = search.trim().replace(/ /g, ' & ');
      return this.doctorEntityRepository
        .createQueryBuilder('doctor')
        .leftJoinAndSelect('doctor.user', 'user')
        .where(
          `to_tsvector('english', user.name) @@ to_tsquery('english', :search)`,
          {
            search: `${formattedQuery}:*`,
          },
        )
        .orWhere(
          `to_tsvector('english', doctor.profession) @@ to_tsquery('english', :search)`,
          {
            search: `${formattedQuery}:*`,
          },
        )
        .orWhere(
          `to_tsvector('english', user.username) @@ to_tsquery('english', :search)`,
          {
            search: `${formattedQuery}:*`,
          },
        )
        .getMany();
    }
    return this.doctorEntityRepository.find({
      where: { is_verified: true },
      relations: ['user', 'licence'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getAllUnverified() {
    return this.doctorEntityRepository.find({
      where: { is_verified: false },
      relations: ['user', 'licence'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getAllSubscribed(user: User) {
    return this.doctorEntityRepository.findOne({
      where: { id: user.doctor.id },
      relations: ['subscribed.user'],
    });
  }

  verifyDoctor(id: VerifyDto) {
    return this.doctorEntityRepository.update(
      {
        id: id.id,
      },
      {
        is_verified: true,
      },
    );
  }
}
