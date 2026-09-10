import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../../config/db';
import { logger } from '../../utils/logger';

export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  filename: string;
  sizeBytes: number;
  createdAt: Date;
}

export class MediaService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  async init() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      logger.error('Failed to create upload directory:', err);
    }
  }

  async uploadFile(file: Express.Multer.File, problemId?: string) {
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, filename);

    // In a real production app, we would upload to S3/GCS here
    // For now, we move the file from multer's temp location to our uploads folder
    await fs.rename(file.path, filePath);

    const media = await prisma.mediaAttachment.create({
      data: {
        url: `/uploads/${filename}`,
        type: this.determineType(file.mimetype),
        filename: file.originalname,
        sizeBytes: file.size,
        problemId: problemId,
      },
    });

    return media;
  }

  private determineType(mimetype: string): 'image' | 'video' | 'document' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'document';
  }

  async deleteFile(mediaId: string) {
    const media = await prisma.mediaAttachment.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error('Media not found');

    const filePath = path.join(this.uploadDir, path.basename(media.url));
    try {
      await fs.unlink(filePath);
    } catch (err) {
      logger.warn(`Could not delete file ${filePath}, it might have been already removed`);
    }

    await prisma.mediaAttachment.delete({ where: { id: mediaId } });
  }
}

export const mediaService = new MediaService();
