import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserDto) {
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
      const user = await this.users.save(this.users.create(createUserInput));
      return {
        user,
      };
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

  findOne(username: string): Promise<User> {
    return this.users.findOne({ where: { username } });
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
}
