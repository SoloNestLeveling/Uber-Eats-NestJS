import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { User } from 'src/users/decorator/user.decorator';
import { RoleTypeEnum, UsersModel } from 'src/users/entity/users.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Role } from 'src/users/decorator/role.decorator';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }



  @Post()
  @Role(RoleTypeEnum.OWNER)
  createRestaurant(
    @User() owner: UsersModel,
    @Body() dto: CreateRestaurantDto
  ) {
    return this.restaurantsService.createRes(dto, owner.id);
  }


  @Get(':id')
  @IsPublic(PublicTypeEnum.PUBLIC)
  getRestaurant(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.restaurantsService.getRestaurantById(id)
  };
}
