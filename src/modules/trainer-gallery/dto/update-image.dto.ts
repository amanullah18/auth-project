// src/trainer-gallery/dto/update-image.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateImageDto {
  caption?: string;  // Assuming caption is a string, make sure it's correct
  sortOrder?: number; // This should be a number, not a string
}