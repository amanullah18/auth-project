import {
  Controller,
  Post,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../../shared/services/s3.service';
import { UsersService } from '../users/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}
  @Post('upload-profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('x-access-token') // 👈 MUST match name in Swagger config
  @ApiOperation({ summary: 'Upload a profile image to S3 (and optionally local)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object', 
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Profile image uploaded successfully' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const result = await this.s3Service.uploadFile(file, req.user.id);
    return {
      message: 'Uploaded successfully!',
      url: result.Location,
    };
  }

  @Patch('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('x-access-token') // 👈 MUST match name in Swagger config
  @ApiOperation({ summary: 'Upload and update user profile image in DB and S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile image updated successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const roleId = req.user.roleId;
    const result = await this.s3Service.uploadFile(file, req.user.id);

    await this.usersService.updateProfile(
      req.user.id,
      { profilePhotoUrl: result.Location },
      roleId,
    );

    return {
      message: 'Profile image uploaded successfully!',
      url: result.Location,
    };
  }
}
