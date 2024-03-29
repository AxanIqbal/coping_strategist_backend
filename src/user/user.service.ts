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
import { SignUpDto } from '../auth/dto/sign-up.dto';
import admin from 'firebase-admin';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async create(createUserInput: SignUpDto): Promise<User> {
    if (createUserInput.role !== UserRole.doctor) {
      delete createUserInput.doctor;
    }
    const currUser = await this.users.findOne({
      where: [
        { username: createUserInput.username },
        { email: createUserInput.email },
      ],
    });

    if (currUser) {
      throw new ConflictException('User Already Exists');
    }

    const user = await this.users
      .save(this.users.create(createUserInput))
      .catch((reason) => {
        if (reason.code === '23505') {
          throw new ConflictException('User Already Exists');
        } else {
          throw new Error(reason);
        }
      });
    if (user.role === UserRole.merchant) {
      await this.merchantRepository.save(
        this.merchantRepository.create({
          user,
        }),
      );
    }

    return user;
  }

  findAll(): Promise<User[]> {
    return this.users.find();
  }

  findOne(username: string, isMe = false): Promise<User> {
    const relations = [];
    if (isMe) {
      relations.push('doctor');
      relations.push('patient');
      relations.push('merchant');
    }
    return this.users.findOne({ where: { username }, relations });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  update(updateUserInput: UpdateUserDto, user: User): Promise<UpdateResult> {
    return this.users.update({ id: user.id }, updateUserInput);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getAllMerchants() {
    return this.users.find({
      where: {
        role: UserRole.merchant,
      },
      relations: ['merchant'],
    });
  }
}
