import { Module } from '@nestjs/common';
import { TrainerSocialLinkService } from './trainer-social-link.service';
import { TrainerSocialLinkController } from './trainer-social-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerSocialLink } from '../trainer/entities/trainer-social-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerSocialLink])],
  controllers: [TrainerSocialLinkController],
  providers: [TrainerSocialLinkService],
})
export class TrainerSocialLinkModule {}
