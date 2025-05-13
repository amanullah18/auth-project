import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../../shared/services/s3.service';
import { UsersService } from '../users/users.service';
import { GetUser } from '../auth/common/decorators/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  @Post('upload-profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const result = await this.s3Service.uploadFile(file, req.user.id);  // Pass the user ID here
    return {
      message: 'Uploaded successfully!',
      url: result.Location,
    };
  }

  @Patch('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const roleId = req.user.roleId;  // Get the role ID dynamically from the user object
    const result = await this.s3Service.uploadFile(file, req.user.id);  // Pass the user ID here

    // Update the profile photo URL in the user record
    await this.usersService.updateProfile(req.user.id, { profilePhotoUrl: result.Location }, roleId);

    return {
      message: 'Profile image uploaded successfully!',
      url: result.Location,
    };
  }
}
