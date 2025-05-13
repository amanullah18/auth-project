import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsUrl()
  url: string;
}
