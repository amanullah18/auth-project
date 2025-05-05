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
  import { CreateSocialLinkDto } from './create-social-link.dto';
  import { UpdateSocialLinkDto } from './update-social-link.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // adjust path
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Trainer Social Links')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('trainer/social-links')
  export class TrainerSocialLinkController {
    constructor(private readonly service: TrainerSocialLinkService) {}
  
    @Post()
    create(@Body() dto: CreateSocialLinkDto, @Req() req) {
      return this.service.create(dto, req.user);
    }
  
    @Get()
    findAll(@Req() req) {
      return this.service.findAll(req.user);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateSocialLinkDto,
      @Req() req,
    ) {
      return this.service.update(id, dto, req.user);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
      return this.service.remove(id, req.user);
    }
  }
  