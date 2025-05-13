import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import {ProfileModule} from './modules/profile/profile.module'
import { TrainerSocialLinkModule } from './modules/trainer/trainer-social-link.module'
import { ImagesModule } from './modules/images/images.module';
import { SkillsModule } from './modules/skills/skills.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'task1',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ProfileModule,
    TrainerSocialLinkModule,
    ImagesModule,
    SkillsModule
  ],
})
export class AppModule {}