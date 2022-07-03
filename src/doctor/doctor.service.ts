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
      relations: ['user'],
    });
  }
}
