import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsUserAlreadyExist } from './is-user-already-exist.validator';
import { ClinicModule } from '../clinic/clinic.module';
import { Merchant } from './entities/merchant.entity';

@Module({
  imports: [ClinicModule, TypeOrmModule.forFeature([User, Merchant])],
  controllers: [UserController],
  providers: [UserService, IsUserAlreadyExist],
  exports: [UserService],
})
export class UserModule {}
