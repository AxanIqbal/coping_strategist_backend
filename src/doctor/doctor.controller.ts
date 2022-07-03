import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';

@Controller('doctor')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  getAll(@Query('search') search?: string): Promise<Doctor[]> {
    return this.doctorService.getAll(search);
  }

  @Get(':id')
  async findOneDoctor(@Param('id') id: number): Promise<Doctor> {
    return this.doctorService.findOneDoctor(id);
  }
}
