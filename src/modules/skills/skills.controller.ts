import { Controller, Get, Post, Delete, Body, Param, Query, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('skills') // Tag for grouping related API endpoints
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter skills by category' })
  @ApiResponse({ status: 200, description: 'Skills fetched successfully', type: [Skill] })
  async findAll(@Query('category') category: string): Promise<Skill[]> {
    try {
      return await this.skillsService.findAll(category);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully', type: Skill })
  @ApiResponse({ status: 409, description: 'Skill with the same name or slug already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    try {
      return await this.skillsService.createSkill(createSkillDto);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('Skill with this name or slug already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill by ID' })
  @ApiResponse({ status: 204, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.skillsService.removeSkill(id);
    } catch (error) {
      throw new NotFoundException('Skill not found');
    }
  }
}
