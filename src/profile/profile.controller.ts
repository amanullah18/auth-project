import {
    Controller,
    Post,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Req,
    Body,
    Patch,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { S3Service } from '../S3/s3.service';
  import { UsersService } from '../users/users.service';
  import { GetUser } from '../common/decorators/get-user.decorator';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller()
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
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const result = await this.s3Service.uploadFile(file);
      return {
        message: 'Uploaded successfully!',
        url: result.Location,
      };
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch('client/upload-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadClientImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
      const clientRoleId = 2;
      const result = await this.s3Service.uploadFile(file);
      console.log(req.user);
      return this.usersService.updateProfile(req.user.userId, { profilePhotoUrl: result.Location }, clientRoleId);

  
    }
  
    @UseGuards(JwtAuthGuard)
  @Patch('trainer/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrainerImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const trainerRoleId = 3;
    const result = await this.s3Service.uploadFile(file);
    return this.usersService.updateProfile(req.user.userId, { profilePhotoUrl: result.Location }, trainerRoleId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAdminImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const adminRoleId = 1;
    const result = await this.s3Service.uploadFile(file);
    console.log(req.user);
    return this.usersService.updateProfile(req.user.userId, { profilePhotoUrl: result.Location }, adminRoleId);
  }
  }
