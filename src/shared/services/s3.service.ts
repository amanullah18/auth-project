import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET') || 'user-profile-images';

    this.s3 = new AWS.S3({
      endpoint: this.configService.get<string>('S3_ENDPOINT') || 'http://localhost:9000',
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') || 'minioadmin',
      secretAccessKey: this.configService.get<string>('S3_SECRET_KEY') || 'minioadmin',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  /**
   * Upload file buffer to S3 for a specific trainer's gallery
   */
  async uploadFile(file: Express.Multer.File, trainerId: number): Promise<AWS.S3.ManagedUpload.SendData> {
    const folder = `trainers/${trainerId}/gallery`; // Store in 'trainers/{trainerId}/gallery'
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const result = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL can be omitted to keep files private
      })
      .promise();

    return result;
  }

  /**
   * Generate a pre-signed URL for uploading a gallery image
   */
  async generatePresignedUploadUrl(filename: string, trainerId: number): Promise<string> {
    const folder = `trainers/${trainerId}/gallery`;
    const key = `${folder}/${filename}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 300, // URL will expire after 5 minutes
    };

    return this.s3.getSignedUrlPromise('putObject', params); // 'putObject' is used for uploads
  }

  /**
   * Generate a pre-signed URL for viewing a gallery image
   */
  async generatePresignedUrl(filename: string, trainerId: number): Promise<string> {
    const folder = `trainers/${trainerId}/gallery`;
    const key = `${folder}/${filename}`;
    const expireSeconds = parseInt(this.configService.get<string>('S3_URL_EXPIRE_SECONDS') || '300', 10);

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expireSeconds,
    };

    return this.s3.getSignedUrlPromise('getObject', params); // 'getObject' is used for fetching objects
  }

  /**
   * Delete a gallery image for a specific trainer
   */
  async deleteObject(filename: string, trainerId: number): Promise<void> {
    const folder = `trainers/${trainerId}/gallery`;
    const key = filename.startsWith(`${folder}/`) ? filename : `${folder}/${filename}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  /**
   * Check if object exists in S3 for a specific trainer's gallery
   */
  async objectExists(filename: string, trainerId: number): Promise<boolean> {
    const folder = `trainers/${trainerId}/gallery`;
    const key = filename.startsWith(`${folder}/`) ? filename : `${folder}/${filename}`;

    try {
      await this.s3
        .headObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();
      return true;
    } catch (error: any) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * List all images for a specific trainer's gallery
   */
  async listImages(trainerId: number): Promise<AWS.S3.ObjectList> {
    const folder = `trainers/${trainerId}/gallery`;

    const params = {
      Bucket: this.bucketName,
      Prefix: folder,
    };

    const data = await this.s3.listObjectsV2(params).promise();
    return data.Contents || [];
  }
}
