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
import {User} from "src/modules/users/entities/users.entity"
import {TrainerSkillImage} from "src/modules/trainer-skills/entities/trainer-skill-image.entity"
import {TrainerSkill} from "src/modules/trainer-skills/entities/trainer-skill.entity"
import {GalleryImage} from "src/modules/trainer-gallery/entities/trainer-gallery.entity"
import {TrainerSocialLink} from "src/modules/trainer/entities/trainer-social-link.entity"
import {Skill} from "src/modules/skills/entities/skill.entity"
import {Role} from "src/modules/roles/entities/roles.entity"
import {RolePermission} from "src/modules/roles/entities/role-permission.entity"

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
        entities: [User,TrainerSkill,TrainerSkillImage,Role,RolePermission,Skill,GalleryImage,TrainerSocialLink],
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