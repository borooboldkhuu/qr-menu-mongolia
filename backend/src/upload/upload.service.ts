import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private isConfigured: boolean;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.isConfigured = !!cloudName && cloudName !== 'demo';
    if (this.isConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<{ url: string; publicId: string }> {
    if (!file) throw new BadRequestException('Файл оруулна уу');

    // Fallback: return base64 data URL when Cloudinary is not configured
    if (!this.isConfigured) {
      const base64 = file.buffer.toString('base64');
      const mime = file.mimetype || 'image/png';
      const dataUrl = `data:${mime};base64,${base64}`;
      return { url: dataUrl, publicId: 'local-' + Date.now() };
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `qr-menu-mongolia/${folder}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error: any, result: UploadApiResponse) => {
          if (error) return reject(new BadRequestException('Зураг байршуулахад алдаа гарлаа'));
          resolve({ url: result!.secure_url, publicId: result!.public_id });
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    if (publicId.startsWith('local-')) return; // Skip local files
    await cloudinary.uploader.destroy(publicId);
  }
}
