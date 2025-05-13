import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({
    description: 'The name of the skill',
    example: 'JavaScript',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The slug of the skill (URL-friendly version)',
    example: 'javascript',
  })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    description: 'The category of the skill (optional)',
    example: 'Frontend',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'The URL of the skill image (optional)',
    example: 'https://cdn.example.com/skills/javascript.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
