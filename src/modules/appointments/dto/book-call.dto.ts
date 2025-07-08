import { IsString, IsNotEmpty, IsEmail, IsUUID } from 'class-validator';

export class BookCallDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  slotId: string;
} 