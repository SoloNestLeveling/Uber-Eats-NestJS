import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { basename, extname, join } from 'path';
import { v4 as uuid } from "uuid";
import * as multer from "multer"
import { TEMP_FOLDER_PATH } from './const/image-path.const';


@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1000000
      },
      fileFilter(req, file, fn) {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          return fn(new BadRequestException(".jpg, .png, .jpeg 이미지 파일만 업로드 가능합니다."), false)
        };
        return fn(null, true)
      },
      storage: multer.diskStorage({
        destination(req, res, fn) {
          fn(null, `/${join(TEMP_FOLDER_PATH)}`)
        },
        filename(req, file, fn) {
          fn(null, `${uuid()}${extname(file.originalname)}`)
        },
      })
    })
  ],
  exports: [CommonService],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule { }
