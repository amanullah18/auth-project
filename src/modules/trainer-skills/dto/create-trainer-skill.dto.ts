import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTrainerSkillDto {
  @IsString()
  @IsNotEmpty()
  experience_desc: string;

  @IsInt()
  @Min(0)
  years_of_experience: number;
}
