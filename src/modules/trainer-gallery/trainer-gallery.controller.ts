// src/trainer-gallery/trainer-gallery.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming this is your JWT guard
import { CurrentUser } from '../users/decorator/current-user.decorator'; // Custom decorator to extract the user
import { TrainerGalleryService } from './trainer-gallery.service';
import { CreateImageDto } from '../trainer-gallery/dto/create_image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { User } from '../users/entities/users.entity';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Trainer Gallery')
@Controller('trainers/:trainerId/gallery')
@UseGuards(JwtAuthGuard)
export class TrainerGalleryController {
  constructor(private readonly galleryService: TrainerGalleryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery image' })
  @ApiResponse({ status: 200, description: 'Pre-signed URL returned', type: String })
  async create(
    @Param('trainerId') trainerId: number,
    @Body() createImageDto: CreateImageDto,
    @CurrentUser() user: User,
  ) {
    return this.galleryService.createImage(trainerId, createImageDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery images' })
  @ApiResponse({ status: 200, description: 'Gallery images retrieved', type: Array })
  async getGallery(
    @Param('trainerId') trainerId: number,
    @CurrentUser() user: User,
  ) {
    return this.galleryService.getGalleryImages(trainerId, user);
  }

  @Patch(':imageId')
  @ApiOperation({ summary: 'Update image metadata' })
  @ApiResponse({ status: 200, description: 'Image updated successfully', type: Object })
  async updateImage(
    @Param('trainerId') trainerId: number,
    @Param('imageId') imageId: number,
    @Body() updateImageDto: UpdateImageDto,
    @CurrentUser() user: User,
  ) {
    return this.galleryService.updateImageInfo(trainerId, imageId, updateImageDto, user);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Delete a gallery image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully', type: Object })
  async deleteImage(
    @Param('trainerId') trainerId: number,
    @Param('imageId') imageId: number,
    @CurrentUser() user: User,
  ) {
    return this.galleryService.deleteImage(trainerId, imageId, user);
  }
}
