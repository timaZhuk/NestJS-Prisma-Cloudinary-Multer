import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // -- method for uploading files
  private uploadToCloudinary(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  //---Upload files to DB
  async uploadFile(file: Express.Multer.File) {
    try {
      //upload to cloudinary
      const uploadResult = await this.uploadToCloudinary(file.path);
      //save in DB
      const newlysavedFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });
      //delete from "uploads" folder
      fs.unlinkSync(file.path);

      return newlysavedFile;
    } catch (error) {
      //removing in case of any error -> this file from local folder
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new InternalServerErrorException(
        'File upload faild! Please try again after fixing issue',
      );
    }
  }

  // -- Delete image from cloudinary and DB
  async deleteFile(fileId: string) {
    try {
      //find image in DB
      const file = await this.prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });
      if (!file) {
        throw new Error('File not found! Please try with a different file ID');
      }
      //delete from cloudinary
      await cloudinary.uploader.destroy(file.publicId);
      //delete in DB
      await this.prisma.file.delete({
        where: { id: fileId },
      });

      return { message: 'File deleted successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(
        'File deleting process is faild! Check if the data is correct',
      );
    }
  }
}
