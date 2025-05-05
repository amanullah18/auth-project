import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { S3Module } from '../S3/s3.module';

@Module({
  imports: [UsersModule, S3Module],
  controllers: [ProfileController],
})
export class ProfileModule {}
