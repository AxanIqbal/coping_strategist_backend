import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostType } from './entities/post.entity';
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

    return this.postRepository.save(
      this.postRepository.create({
        ...createPostDto,
        merchant: {
          id: user.merchant.id,
        },
      }),
    );
  }

  findAll(type: PostType) {
    if (type) {
      return this.postRepository.find({
        where: { type },
        relations: ['merchant.user'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.postRepository.find({
      relations: ['merchant.user'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number, user: User) {
    const posts = await this.findPost(user);
    const index = posts.findIndex((value) => value.id === id);
    if (index >= 0) {
      return this.postRepository.remove(posts[index]);
    } else {
      throw new ConflictException('Not your post or Not Found');
    }
  }

  findPost(user: User) {
    return this.postRepository.find({
      where: {
        merchant: {
          id: user.merchant.id,
        },
      },
    });
  }
}
