import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Skill } from '../entities/skill.entity';

@Injectable()
export class SkillsSeeder {
  constructor(private connection: Connection) {}

  async run() {
    const skillsRepository = this.connection.getRepository(Skill);
    const skills = [
      { name: 'JavaScript', slug: 'javascript', category: 'Frontend', image: 'https://cdn.example.com/skills/javascript.png' },
      { name: 'Node.js', slug: 'nodejs', category: 'Backend', image: 'https://cdn.example.com/skills/nodejs.png' },
    ];

    for (const skill of skills) {
      const existingSkill = await skillsRepository.findOne({ where: { slug: skill.slug } });
      if (!existingSkill) {
        await skillsRepository.save(skill);
      }
    }
  }
}
