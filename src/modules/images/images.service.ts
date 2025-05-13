import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from '../../shared/services/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) {}

  async getPresignedUrl(filename: string): Promise<{ url: string; expiresIn: number }> {
    // Check if the image exists in S3
    const exists = await this.s3Service.objectExists(filename);
    if (!exists) {
      throw new NotFoundException(`Image with filename ${filename} not found`);
    }

    // Generate pre-signed URL
    const url = await this.s3Service.generatePresignedUrl(filename);
    
    return {
      url,
      expiresIn: parseInt(this.configService.get('S3_URL_EXPIRE_SECONDS') || '300', 10),
    };
  }
}