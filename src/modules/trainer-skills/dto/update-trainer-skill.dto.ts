import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateTrainerSkillDto {
  @IsOptional()
  @IsString()
  experience_desc?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  years_of_experience?: number;
}
