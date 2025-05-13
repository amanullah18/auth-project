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
    // Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Use ConfigService to inject DB config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: +config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'task1'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Use migrations, not sync in production
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
