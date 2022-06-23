import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateFavDto } from './dto/create-fav.dto';
import { ClinicService } from '../clinic/clinic.service';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { DoctorEntity } from './entities/doctor.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(DoctorEntity)
    private readonly doctorEntityRepository: Repository<DoctorEntity>,
    private readonly clinicService: ClinicService,
  ) {}

  async create(createUserInput: SignUpDto): Promise<HttpException | User> {
    if (createUserInput.role !== UserRole.doctor) {
      delete createUserInput.doctor;
    }
    try {
      const exists = await this.users.findOne({
        where: [
          { email: createUserInput.email },
          { username: createUserInput.username },
        ],
      });
      if (exists) {
        return new HttpException('Already Exists', HttpStatus.FOUND);
      }
      return await this.users.save(this.users.create(createUserInput));
    } catch (e) {
      console.log(e);
      return new HttpException(
        "Couldn't create account",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll(): Promise<User[]> {
    return this.users.find();
  }

  findOne(username: string, isMe = false): Promise<User> {
    const relations = [];
    if (isMe) {
      relations.push('appointments');
      relations.push('favorites');
    }
    return this.users.findOne({ where: { username }, relations });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  update(updateUserInput: UpdateUserDto): Promise<UpdateResult> {
    return this.users.update({ id: updateUserInput.id }, updateUserInput);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getAllMyData(user: User) {
    return this.users.findOne({
      where: { id: user.id },
      relations: ['favorites', 'appointments'],
    });
  }

  async addFav(user: User, favId: CreateFavDto) {
    return this.users
      .query(
        `insert into "user_favorites_clinic"("userId", "clinicId") VALUES (${user.id}, ${favId.id})`,
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
    return this.users
      .query(
        `delete from "user_favorites_clinic" where "clinicId"=${favId.id} and "userId"=${user.id}`,
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

  findOneDoctor(id: number) {
    return this.doctorEntityRepository.findOne({
      where: { id },
      relations: ['appointments', 'user'],
    });
  }
}
