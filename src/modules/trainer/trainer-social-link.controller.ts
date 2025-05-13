import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    ParseIntPipe,
  } from '@nestjs/common';
  import { TrainerSocialLinkService } from './trainer-social-link.service';
  import { CreateSocialLinkDto } from '../trainer/dtos/create-social-link.dto';
  import { UpdateSocialLinkDto } from '../trainer/dtos/update-social-link.dto';
  import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard'; // adjust path
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Trainer Social Links')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('trainer/social-links')
  export class TrainerSocialLinkController {
    constructor(private readonly service: TrainerSocialLinkService) {}
  
    @Post()
    create(@Body() dto: CreateSocialLinkDto, @Req() req) {
      const trainer = { id: req.user.userId }; // Use the correct ID field
      return this.service.create(dto, trainer);
    }
    @Get()
    findAll(@Req() req) {
      return this.service.findAll(req.user.userId);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateSocialLinkDto,
      @Req() req,
    ) {
      return this.service.update(id, dto, req.user.userId);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
      return this.service.remove(id, req.user.userId);
    }
  }
  