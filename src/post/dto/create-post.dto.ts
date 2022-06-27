import { IsNumber, IsString } from 'class-validator';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends Post {}
