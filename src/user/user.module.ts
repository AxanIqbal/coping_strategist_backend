import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsUserAlreadyExist } from './is-user-already-exist.validator';
import { ClinicModule } from '../clinic/clinic.module';
import { DoctorEntity } from './entities/doctor.entity';
import { DoctorController } from './doctor.controller';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [ClinicModule, TypeOrmModule.forFeature([User, DoctorEntity])],
  controllers: [UserController, DoctorController, FavoriteController],
  providers: [UserService, IsUserAlreadyExist],
  exports: [UserService],
})
export class UserModule {}
