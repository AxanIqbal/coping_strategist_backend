import { HttpException, Injectable } from '@nestjs/common';
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

  async findAll(
    radius: number,
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
      // return this.clinicRepository.query(
      //   `SELECT * ,
      //  ST_Distance(location, ST_MakePoint(${longitude}, ${latitude})) AS distance
      //   FROM clinic LEFT JOIN clinic_pictures_entity on clinic_pictures_entity.clinicId=clinic.id
      //   WHERE ST_DWithin(location, ST_MakePoint(${longitude}, ${latitude}), ${radius} * 1000) ORDER BY distance;`,
      // );
      // return this.clinicRepository.query(
      //   `SELECT * , ST_Distance(ST_MakePoint(${longitude}, ${latitude} ), location) AS distance FROM clinic ORDER BY distance;`,
      // );
    }
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

  async remove(id: number) {
    const clinic = await this.clinicRepository.findOne({ where: { id } });
    if (!clinic) {
      throw new HttpException('Clinic not found', 404);
    }
    return this.clinicRepository.remove(clinic);
  }
}
