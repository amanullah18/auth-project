import { Module } from '@nestjs/common';
import { TrainerGalleryService } from '../trainer-gallery/trainer-gallery.service';
import { TrainerGalleryController } from '../trainer-gallery/trainer-gallery.controller';
import { S3Service } from '../../shared/services/s3.service';  // Importing your existing S3Service
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryImage } from '../trainer-gallery/entities/trainer-gallery.entity'; // Create an entity for the gallery images

@Module({
  imports: [TypeOrmModule.forFeature([GalleryImage])], // Import the gallery entity
  providers: [TrainerGalleryService, S3Service],
  controllers: [TrainerGalleryController],
})
export class TrainerGalleryModule {}
