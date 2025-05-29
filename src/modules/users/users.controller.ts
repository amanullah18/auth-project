import { Controller, Get, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiSecurity, // Changed from ApiBearerAuth
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiSecurity('x-access-token') // Changed to ApiSecurity to match your apiKey config
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'The authenticated user profile has been returned.',
    schema: {
      example: {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid JWT' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user.id, fullName: user.fullName, email: user.email };
  }
} 