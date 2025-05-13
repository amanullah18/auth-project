// images.controller.ts

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // optional

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
@ApiTags('Images')
@Controller('images')

export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Get(':filename/url')
  @ApiOperation({ summary: 'Generate a pre-signed URL for accessing a private image' })
  @ApiParam({ name: 'filename', description: 'Name of the image file in S3' })
  @ApiResponse({ status: 200, description: 'Returns a temporary pre-signed URL for the image.' })
  @ApiResponse({ status: 404, description: 'Image not found in S3' })
  @ApiBearerAuth() // Enable this if using JWT

  @UseGuards(JwtAuthGuard) // optional, for auth protection
  @Get(':filename/url')
  async getPresignedUrl(@Param('filename') filename: string) {
    return this.imagesService.getPresignedUrl(filename);
  }
}
