import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  markdown: string;
}
