import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
  getAll(): Promise<Doctor[]> {
    return this.doctorService.getAll();
  }

  @Get(':id')
  async findOneDoctor(@Param('id') id: number): Promise<Doctor> {
    return this.doctorService.findOneDoctor(id);
  }
}
