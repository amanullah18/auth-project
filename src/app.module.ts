// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TrainerSocialLinkModule } from './modules/trainer/trainer-social-link.module';
import { ImagesModule } from './modules/images/images.module';
import { SkillsModule } from './modules/skills/skills.module';
import { TrainerSkillsModule } from './modules/trainer-skills/trainer-skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/dist/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),

    // Other feature modules
    AuthModule,
    UsersModule,
    ProfileModule,
    TrainerSocialLinkModule,
    ImagesModule,
    SkillsModule,
    TrainerSkillsModule,
  ],
})
export class AppModule { }