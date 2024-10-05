import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsPublic } from './decorator/public.decorator';
import { PublicTypeEnum } from './enum/public.enum';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) { }


  @Post('image')
  @IsPublic(PublicTypeEnum.PUBLIC)
  @UseInterceptors(FileInterceptor('image'))
  createTempImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      filename: file.filename
    }
  }
}
