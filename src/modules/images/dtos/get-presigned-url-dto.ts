import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPresignedUrlDto {
  @ApiProperty({
    description: 'Image filename to generate presigned URL for',
    example: 'profile-images/1715693428347-avatar.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:profile-images\/)?[a-zA-Z0-9-_\.]+\.(jpg|jpeg|png|gif|webp)$/, {
    message: 'Invalid filename format. Should be a valid image filename with optional profile-images/ prefix.',
  })
  filename: string;
}
