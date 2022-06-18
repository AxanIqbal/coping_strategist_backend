import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto, CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { Repository } from 'typeorm';
import { ClinicAppointments } from './entities/clinic.appointments.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(ClinicAppointments)
    private readonly appointmentRepository: Repository<ClinicAppointments>,
  ) {}

  create(createClinicDto: CreateClinicDto) {
    return this.clinicRepository.save(
      this.clinicRepository.create(createClinicDto),
    );
  }

  async createAppointment(createAppointment: CreateAppointmentDto, user: User) {
    const clinic = await this.clinicRepository.findOne({
      where: { id: createAppointment.clinic },
    });
    if (!clinic) {
      throw new HttpException('Clinic not found', HttpStatus.NOT_FOUND);
    }
    return this.appointmentRepository.save(
      this.appointmentRepository.create({
        date: createAppointment.date,
        patient: user,
        clinic: clinic,
      }),
    );
  }

  async findAll(
    radius: number,
    search?: string,
    latitude?: number,
    longitude?: number,
  ): Promise<Clinic[]> {
    if (latitude && longitude) {
      const raw_entity = await this.clinicRepository
        .createQueryBuilder('clinic')
        .addSelect(
          `ST_Distance(location, ST_MakePoint(${longitude}, ${latitude}))`,
          'distance',
        )
        .leftJoinAndSelect('clinic.pictures', 'clinic_pictures_entity')
        .where(
          `ST_DWithin(location, ST_MakePoint(:longitude, :latitude), :radius * 1000)`,
          { longitude, latitude, radius },
        )
        .orderBy('distance')
        .getRawAndEntities();

      for (const entity of raw_entity.entities) {
        const raw = raw_entity.raw.find((raw) => raw.clinic_id === entity.id);
        entity.distance = raw.distance;
      }

      return raw_entity.entities;
    }
    if (search) {
      const formattedQuery = search.trim().replace(/ /g, ' & ');
      return this.clinicRepository
        .createQueryBuilder('clinic')
        .where(
          `to_tsvector('english',clinic.name) @@ to_tsquery('english', :search)`,
          {
            search: `${formattedQuery}:*`,
          },
        )
        .getMany();
    }
    return this.clinicRepository
      .createQueryBuilder('clinic')
      .limit(50)
      .getMany();
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

  async remove(id: number) {
    const clinic = await this.clinicRepository.findOne({ where: { id } });
    if (!clinic) {
      throw new HttpException('Clinic not found', 404);
    }
    return this.clinicRepository.remove(clinic);
  }
}
