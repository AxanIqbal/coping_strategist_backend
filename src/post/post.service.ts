import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, user: User) {
    if (user.role !== UserRole.merchant) {
      throw new MethodNotAllowedException('Not a merchant');
    }
    console.log(user);
    return this.postRepository.save(
      this.postRepository.create({
        ...createPostDto,
        merchant: {
          id: user.merchant.id,
        },
      }),
    );
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
