import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage } from '../trainer-gallery/entities/trainer-gallery.entity'; // Ensure the path is correct
import { S3Service } from '../../shared/services/s3.service'; // S3 service for URL generation
import { User } from '../users/entities/users.entity'; // Ensure the path is correct
import { CreateImageDto } from './dto/create_image.dto'; // Assuming the path for CreateImageDto is correct
import { UpdateImageDto } from './dto/update-image.dto'; // Assuming the path for UpdateImageDto is correct

@Injectable()
export class TrainerGalleryService {
    constructor(
        @InjectRepository(GalleryImage)
        private readonly galleryImageRepository: Repository<GalleryImage>,
        private readonly s3Service: S3Service, // Assuming this is correct
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // Injecting User repository to check for trainer existence
    ) { }

    // Create a new gallery image (upload)
    async createImage(trainerId: number, createImageDto: CreateImageDto, user: User) {
        // Ensure trainer exists
        const trainer = await this.userRepository.findOne({ where: { id: trainerId } });
        if (!trainer) {
            throw new NotFoundException('Trainer not found');
        }

        // Ensure the user is the trainer or has admin privileges (for security)
        if (trainer.id !== user.id && user.roleId !== 1) {
            throw new ForbiddenException('You do not have permission to upload images for this trainer');
        }

        // Check if the trainer has reached the image limit (4 images)
        const existingImages = await this.galleryImageRepository.find({
            where: { user: { id: trainerId } },
        });

        if (existingImages.length >= 4) {
            throw new ForbiddenException(
                'Image limit reached. Please delete an image to upload a new one.',
            );
        }

        // Generate a unique filename
        const filename = `${Date.now()}-${Math.random()}.jpg`; // You can adjust this naming convention if needed

        // Generate the pre-signed URL for the upload
        const presignedUrl = await this.s3Service.generatePresignedUploadUrl(
            filename, // Provide the filename for the S3 upload
            trainerId, // Pass the trainerId for the image's folder structure
        );

        return { presignedUrl };
    }

    // Fetch all gallery images for the trainer
    async getGalleryImages(trainerId: number, user: User) {
        // Ensure trainer exists
        const trainer = await this.userRepository.findOne({ where: { id: trainerId } });
        if (!trainer) {
            throw new NotFoundException('Trainer not found');
        }

        // Fetch all images for the trainer
        const images = await this.galleryImageRepository.find({
            where: { user: { id: trainerId } },
            relations: ['user'], // Ensure the relation is loaded if necessary
        });

        if (!images || images.length === 0) {
            throw new NotFoundException('No gallery images found for this trainer');
        }

        // Generate the signed URLs for images
        const imageUrls = await Promise.all(
            images.map(async (image) => ({
                ...image,
                signedUrl: await this.s3Service.generatePresignedUrl(image.fileUrl, trainerId), // Pass trainerId to get the correct URL
            })),
        );

        return imageUrls;
    }

    // Update image metadata (caption, sort order)
    async updateImageInfo(
        trainerId: number,
        imageId: number,
        updateImageDto: UpdateImageDto,
        user: User,
    ) {
        // Find the image by ID
        const image = await this.galleryImageRepository.findOne({
            where: { id: imageId },
            relations: ['user'],
        });
        if (!image) {
            throw new NotFoundException('Image not found');
        }

        // Ensure the image belongs to the logged-in user (or the user is an admin)
        if (image.user.id !== trainerId && user.roleId !== 1) {
            throw new ForbiddenException('You can only update your own gallery images');
        }

        // Update the image metadata (caption and/or sort order)
        if (updateImageDto.caption) image.caption = updateImageDto.caption;
        if (updateImageDto.sortOrder) image.sortOrder = updateImageDto.sortOrder;

        // Save the updated image
        await this.galleryImageRepository.save(image);

        return { message: 'Image updated successfully', data: image };
    }

    // Delete a gallery image
    async deleteImage(trainerId: number, imageId: number, user: User) {
        // Find the image by ID
        const image = await this.galleryImageRepository.findOne({
            where: { id: imageId },
            relations: ['user'],
        });

        if (!image) {
            throw new NotFoundException('Image not found');
        }

        // Ensure the image belongs to the logged-in user (or the user is an admin)
        if (image.user.id !== trainerId && user.roleId !== 1) {
            throw new ForbiddenException('You can only delete your own gallery images');
        }

        // Delete from S3
        await this.s3Service.deleteObject(image.fileUrl, trainerId); // Ensure to pass trainerId to delete the file correctly

        // Delete from the database
        await this.galleryImageRepository.remove(image);

        return { message: 'Image deleted successfully' };
    }
}
