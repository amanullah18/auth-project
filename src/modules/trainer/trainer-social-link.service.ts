import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerSocialLink } from '../trainer/entities/trainer-social-link.entity';
import { CreateSocialLinkDto } from '../trainer/dtos/create-social-link.dto';
import { UpdateSocialLinkDto } from '../trainer/dtos/update-social-link.dto';
import { User } from '../users/entities/users.entity'; // adjust path as needed

@Injectable()
export class TrainerSocialLinkService {
  constructor(
    @InjectRepository(TrainerSocialLink)
    private repo: Repository<TrainerSocialLink>,
  ) {}

  create(dto: CreateSocialLinkDto, trainer: Pick<User, 'id'>) {
    const link = this.repo.create({
      ...dto,
      trainer: { id: trainer.id } as User,
    });
    return this.repo.save(link);
  }

  async findAll(trainer: User) {
    return this.repo.find({ where: { trainer } });
  }

  async update(id: number, dto: UpdateSocialLinkDto, userId: number) {
    const link = await this.repo.findOne({ where: { id }, relations: ['trainer'] });
    if (!link) throw new NotFoundException('Link not found');
    if (link.trainer.id !== userId) throw new ForbiddenException('Access denied');

    Object.assign(link, dto);
    return this.repo.save(link);
  }

  async remove(id: number, userId: number) {
    const link = await this.repo.findOne({ where: { id }, relations: ['trainer'] });
    if (!link) throw new NotFoundException('Link not found');
    if (link.trainer.id !== userId) throw new ForbiddenException('Access denied');
    return this.repo.remove(link);
  }
}
