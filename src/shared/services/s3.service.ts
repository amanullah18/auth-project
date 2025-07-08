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

  // Existing method to upload a file
  async uploadFile(file: Express.Multer.File,trainerId: number): Promise<AWS.S3.ManagedUpload.SendData> {
    const result = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: `profile-images/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return result;
  }

  // New method to check if an object exists in S3
  async objectExists(filename: string): Promise<boolean> {
    try {
      const headResult = await this.s3.headObject({
        Bucket: this.bucketName,
        Key: filename,
      }).promise();
      return headResult !== null;
    } catch (error) {
      return false; // Return false if the object doesn't exist
    }
  }

  // New method to generate pre-signed URL for uploading
  async generatePresignedUploadUrl(
    fileName: string,
    userId: number,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `profile-images/${userId}/${Date.now()}-${fileName}`,
      Expires: 60 * 60, // 1 hour expiration
      ContentType: 'application/octet-stream',
    };

    const url = await this.s3.getSignedUrlPromise('putObject', params);
    return url;
  }

  // New method to delete a file from S3
  async deleteObject(fileName: string, userId: number): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: `profile-images/${userId}/${fileName}`,
    };

    await this.s3.deleteObject(params).promise();
  }

  // New method for generating a public URL for an existing file
  getPublicUrl(fileName: string, userId: number): string {
    return `https://${this.bucketName}.s3.amazonaws.com/profile-images/${userId}/${fileName}`;
  }
}