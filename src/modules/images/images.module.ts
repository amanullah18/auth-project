// images.module.ts
import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { S3Service } from '../../shared/services/s3.service'; // adjust the path if needed
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // needed for S3Service to access env vars
  controllers: [ImagesController],
  providers: [ImagesService, S3Service],
})
export class ImagesModule {}
