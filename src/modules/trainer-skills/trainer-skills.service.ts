import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity'; // Import User entity
import { TrainerSkill } from '../trainer-skills/entities/trainer-skill.entity';
import { TrainerSkillImage } from '../trainer-skills/entities/trainer-skill-image.entity';
import { CreateTrainerSkillDto } from './dto/create-trainer-skill.dto';
import { UpdateTrainerSkillDto } from './dto/update-trainer-skill.dto';
import { S3Service } from '../../shared/services/s3.service'; // Import S3Service

@Injectable()
export class TrainerSkillsService {
  constructor(
    @InjectRepository(TrainerSkill)
    private readonly trainerSkillRepo: Repository<TrainerSkill>,
    @InjectRepository(TrainerSkillImage)
    private readonly trainerSkillImageRepo: Repository<TrainerSkillImage>,
    @InjectRepository(User)  // Inject User repository
    private readonly userRepo: Repository<User>, // Inject User repository
    private readonly s3Service: S3Service, // Inject the S3Service
  ) {}

  // Create a new Trainer Skill for a specific user (trainer)
  async createTrainerSkill(
    trainer_id: number,
    skill_id: string,
    dto: CreateTrainerSkillDto,
  ): Promise<TrainerSkill> {
    // Check if the trainer exists
    const trainer = await this.userRepo.findOne({ where: { id: trainer_id } });
    if (!trainer) {
      throw new NotFoundException('Trainer not found.');
    }

    // Check if the trainer already has this skill
    const existing = await this.trainerSkillRepo.findOne({
      where: {
        trainer: { id: trainer_id },
        skill: { id: skill_id },
      },
    });

    if (existing) {
      throw new ConflictException('Trainer already has this skill assigned.');
    }

    // Create the TrainerSkill
    const trainerSkill = this.trainerSkillRepo.create({
      trainer,  // Assign the User (trainer) entity
      skill: { id: skill_id },  // Assuming skill is an entity with an ID
      ...dto,
    });

    // Save the TrainerSkill
    return this.trainerSkillRepo.save(trainerSkill);
  }

  // Update an existing Trainer Skill for a specific user (trainer)
  async updateTrainerSkill(
    trainer_id: number,
    skill_id: string,
    dto: UpdateTrainerSkillDto,
  ): Promise<TrainerSkill> {
    const trainerSkill = await this.trainerSkillRepo.findOne({
      where: {
        trainer: { id: trainer_id },
        skill: { id: skill_id },
      },
    });

    if (!trainerSkill) {
      throw new NotFoundException('Trainer skill not found.');
    }

    // Update the TrainerSkill entity with new data
    Object.assign(trainerSkill, dto);
    return this.trainerSkillRepo.save(trainerSkill);
  }

  // Get all skills for a specific trainer
  async getTrainerSkills(trainer_id: string): Promise<TrainerSkill[]> {
    const skills = await this.trainerSkillRepo.find({
      where: { trainer: { id: trainer_id } },
      relations: ['skill', 'images'],  // Assuming TrainerSkill has relations to skill and images
    });

    return skills;
  }

  // Delete a specific skill for a trainer
  async deleteTrainerSkill(trainer_id: number, skill_id: string): Promise<void> {
    const trainerSkill = await this.trainerSkillRepo.findOne({
      where: {
        trainer: { id: trainer_id },
        skill: { id: skill_id },
      },
      relations: ['images'], // To delete images as well
    });

    if (!trainerSkill) {
      throw new NotFoundException('Trainer skill not found.');
    }

    // Delete associated images from S3
    for (const image of trainerSkill.images) {
      const fileName = image.image_url.split('.com/')[1]; // Extract file name from URL
      await this.s3Service.deleteObject(fileName, trainer_id); // Use S3Service to delete
    }

    // Remove the TrainerSkill from the database
    await this.trainerSkillRepo.remove(trainerSkill);
  }

  // Add images to a Trainer Skill for a specific trainer
  async addTrainerSkillImages(
    trainer_id: number,
    skill_id: string,
    files: Express.Multer.File[],  // Assume files are Express Multer File objects
  ): Promise<{
    fileName: string;
    uploadUrl: string;
    publicUrl: string;
  }[]> {
    // Find the TrainerSkill by trainer_id and skill_id
    const trainerSkill = await this.trainerSkillRepo.findOne({
      where: {
        trainer: { id: trainer_id },
        skill: { id: skill_id },
      },
      relations: ['images'], // Get the images relation
    });

    if (!trainerSkill) {
      throw new NotFoundException('Trainer skill not found.');
    }

    // Ensure no more than 5 images are uploaded
    if (trainerSkill.images.length + files.length > 5) {
      throw new BadRequestException(
        'Maximum 5 images allowed. Delete existing images to upload new ones.',
      );
    }

    const responses = [];
    // Loop through the files and generate pre-signed URLs for upload
    for (const file of files) {
      const uploadUrl = await this.s3Service.generatePresignedUploadUrl(
        file.originalname,
        trainer_id,
      );

      // Save image information to the database
      const image = this.trainerSkillImageRepo.create({
        trainerSkill,  // Link the image to the trainer skill
        image_url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/trainers/${trainer_id}/gallery/${file.originalname}`,
      });

      await this.trainerSkillImageRepo.save(image);

       responses.push({
    fileName: file.originalname,
    uploadUrl,
    publicUrl: image.image_url,
  });

    return responses;
  }
