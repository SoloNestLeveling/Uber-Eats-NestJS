import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }


  @Get(':id')
  @IsPublic(PublicTypeEnum.PUBLIC)
  getImage(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.imagesService.getImageById(id)
  }
}
