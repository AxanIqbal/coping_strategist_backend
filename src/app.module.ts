import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ClinicModule } from './clinic/clinic.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      uuidExtension: 'pgcrypto',
      autoLoadEntities: true,
      logging: true,
      ssl: process.env.NODE_ENV === 'production',
      extra: {
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      },
    }),
    AuthModule,
    UserModule,
    ClinicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
