import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerSkill } from './entities/trainer-skill.entity';
import { TrainerSkillImage } from './entities/trainer-skill-image.entity';
import { CreateTrainerSkillDto } from './dto/create-trainer-skill.dto';
import { UpdateTrainerSkillDto } from './dto/update-trainer-skill.dto';
import { S3Service } from '../../shared/services/s3.service'; // Adjust if needed
import { User } from 'src/modules/users/entities/users.entity';

@Injectable()
export class TrainerSkillsService {
  constructor(
    @InjectRepository(TrainerSkill)
    private readonly trainerSkillRepo: Repository<TrainerSkill>,

    @InjectRepository(TrainerSkillImage)
    private readonly trainerSkillImageRepo: Repository<TrainerSkillImage>,

    private readonly s3Service: S3Service,
  ) {}

  async create(
    trainer: User,
    createDto: CreateTrainerSkillDto,
    imageFiles: Express.Multer.File[]
  ): Promise<TrainerSkill> {
    if (imageFiles.length > 5) {
      throw new BadRequestException('You can upload a maximum of 5 images per skill');
    }

    const skill = this.trainerSkillRepo.create({
      ...createDto,
      trainer,
    });

    const savedSkill = await this.trainerSkillRepo.save(skill);

    const imageEntities: TrainerSkillImage[] = [];

    for (const file of imageFiles) {
      const upload = await this.s3Service.uploadFile(file, trainer.id);

      const image = this.trainerSkillImageRepo.create({
        image_url: upload.Key,
        trainerSkill: savedSkill,
      });

      imageEntities.push(image);
    }

    savedSkill.images = await this.trainerSkillImageRepo.save(imageEntities);
    return savedSkill;
  }

  async findAll(): Promise<TrainerSkill[]> {
    return this.trainerSkillRepo.find({ relations: ['images', 'skill', 'trainer'] });
  }

  async findOne(id: number): Promise<TrainerSkill> {
    const skill = await this.trainerSkillRepo.findOne({
      where: { id },
      relations: ['images', 'skill', 'trainer'],
    });

    if (!skill) throw new NotFoundException('Trainer skill not found');

    return skill;
  }

  async update(
    id: number,
    trainer: User,
    updateDto: UpdateTrainerSkillDto
  ): Promise<TrainerSkill> {
    const skill = await this.trainerSkillRepo.findOne({
      where: { id },
      relations: ['trainer'],
    });

    if (!skill) throw new NotFoundException('Trainer skill not found');
    if (skill.trainer.id !== trainer.id) throw new ForbiddenException('Not your skill');

    Object.assign(skill, updateDto);
    return this.trainerSkillRepo.save(skill);
  }
 
  async delete(id: number, trainer: User): Promise<void> {
    const skill = await this.trainerSkillRepo.findOne({
      where: { id },
      relations: ['images', 'trainer'],
    });

    if (!skill) throw new NotFoundException('Trainer skill not found');
    if (skill.trainer.id !== trainer.id) throw new ForbiddenException('Not your skill');

    // Delete images from S3
    for (const image of skill.images) {
      await this.s3Service.deleteObject(image.image_url, trainer.id);
    }

    await this.trainerSkillRepo.remove(skill);
  }
}
