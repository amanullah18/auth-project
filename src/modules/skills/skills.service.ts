import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  // Create a new skill
  async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    // Check if the skill already exists based on the slug
    const existingSkill = await this.skillsRepository.findOne({ where: { slug: createSkillDto.slug } });
    if (existingSkill) {
      throw new Error('Skill with this slug already exists');
    }
    // Create and save the new skill
    const skill = this.skillsRepository.create(createSkillDto);
    return this.skillsRepository.save(skill);
  }

  // Fetch all skills, with optional filtering by category
  async findAll(category?: string): Promise<Skill[]> {
    const query = this.skillsRepository.createQueryBuilder('skill');
    if (category) {
      query.andWhere('skill.category = :category', { category });
    }
    return query.getMany();
  }

  // Delete a skill by its ID
  async removeSkill(id: string): Promise<void> {
    const result = await this.skillsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Skill not found');
    }
  }
}
