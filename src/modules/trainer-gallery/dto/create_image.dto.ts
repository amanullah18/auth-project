// src/trainer-gallery/dto/create-image.dto.ts
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['image/jpeg', 'image/png', 'image/jpg'])
  mimeType: string; // Ensures only valid image types are allowed
}
