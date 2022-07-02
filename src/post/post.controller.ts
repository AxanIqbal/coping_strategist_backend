import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { PostType } from './entities/post.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/user-roles.decorator';

@Controller('post')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles('merchant')
  create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query('type') type?: PostType) {
    return this.postService.findAll(type);
  }

  @Get('all')
  @Roles('merchant')
  findPosts(@AuthUser() user: User) {
    return this.postService.findPost(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles('merchant')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.postService.remove(+id, user);
  }
}
