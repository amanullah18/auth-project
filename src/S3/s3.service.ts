import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName = 'user-profile-images';

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('S3_ENDPOINT') || 'http://localhost:9000',
      accessKeyId: this.configService.get('S3_ACCESS_KEY') || 'minioadmin',
      secretAccessKey: this.configService.get('S3_SECRET_KEY') || 'minioadmin',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<AWS.S3.ManagedUpload.SendData> {
    const result = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: `profile-images/${Date.now()}-${file.originalname}`,
        Body: file.buffer, // ✅ Use buffer directly
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return result;
  }
}
