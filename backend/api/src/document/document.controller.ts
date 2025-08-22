import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request, Response } from 'express';
import { File as MulterFile } from 'multer';

function fileName(req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + extname(file.originalname));
}

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async getDocuments(@Req() req) {
    const userId = req.user.id;
    return this.documentService.findAllByUser(userId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: fileName,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  )
  async uploadDocument(
    @UploadedFile() file: MulterFile,
    @Body('type') type: string,
    @Req() req,
    @Res() res: Response,
  ) {
    if (!file || !type) {
      throw new BadRequestException('Type et fichier requis');
    }
    const userId = req.user.id;
    const doc = await this.documentService.create(
      userId,
      type,
      file.originalname,
      file.filename,
    );
    return res.status(HttpStatus.CREATED).json(doc);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.documentService.remove(id, userId);
  }
} 