import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    const appointment = await this.appointmentRepository.findOne({
      where: {
        doctor: { id: createAppointment.doctor },
        date: createAppointment.date,
      },
    });

    if (appointment) {
      throw new ConflictException('Appointment exists in that time');
    }

    return this.appointmentRepository
      .save(
        this.appointmentRepository.create({
          date: createAppointment.date,
          patient: user,
          clinic: { id: createAppointment.clinic },
          doctor: {
            id: createAppointment.doctor,
          },
        }),
      )
      .catch((reason) => {
        if (reason.code === '23503') {
          throw new ConflictException('Clinic or Doctor does not exists');
        } else {
          throw new Error(reason);
        }
      });
  }

  async findAll(
    radius: number,
    search?: string,
    latitude?: number,
    longitude?: number,
  ): Promise<Clinic[]> {
    const base_query = this.clinicRepository
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.pictures', 'clinic_pictures_entity');
    if (latitude && longitude) {
      const raw_entity = await base_query
        .addSelect(
          `ST_Distance(location, ST_MakePoint(${longitude}, ${latitude}))`,
          'distance',
        )
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
      return base_query
        .where(
          `to_tsvector('english',clinic.name) @@ to_tsquery('english', :search)`,
          {
            search: `${formattedQuery}:*`,
          },
        )
        .getMany();
    }
    return base_query.limit(50).getMany();
  }

  findOne(id: number) {
    return this.clinicRepository.findOne({
      where: { id },
      relations: ['doctors'],
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
