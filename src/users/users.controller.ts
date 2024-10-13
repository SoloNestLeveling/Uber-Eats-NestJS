import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get(':id')
  @IsPublic(PublicTypeEnum.PUBLIC)
  getUser(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.getUserById(id)
  };


  @Post('history/:id')
  @IsPublic(PublicTypeEnum.PUBLIC)
  deleteHistory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.deletHistory(id)
  };
}
