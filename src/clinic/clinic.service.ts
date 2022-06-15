import { Injectable } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  create(createClinicDto: CreateClinicDto) {
    return this.clinicRepository.save(
      this.clinicRepository.create(createClinicDto),
    );
  }

  async findAll() {
    return this.clinicRepository.find();
  }

  findOne(id: number) {
    return this.clinicRepository.findOne({
      where: { id },
      relations: ['timings'],
    });
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
