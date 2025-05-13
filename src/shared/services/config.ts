import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
  bucketName: process.env.S3_BUCKET_NAME || 'user-profile-images',
  urlExpireSeconds: parseInt(process.env.S3_URL_EXPIRE_SECONDS || '300', 10),
}));