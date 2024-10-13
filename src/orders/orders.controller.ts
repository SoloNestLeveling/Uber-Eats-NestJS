import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/decorator/user.decorator';
import { RoleTypeEnum, UsersModel } from 'src/users/entity/users.entity';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';
import { UserOrderDto } from './dto/allow-order.dto';
import { Role } from 'src/users/decorator/role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  @Post('create/:id')
  createOrder(
    @Param('id', ParseIntPipe) restaurantId: number,
    @Body() dto: CreateOrderDto,
    @User() user: UsersModel
  ) {
    return this.ordersService.createOrder(dto, user.id, restaurantId)
  };


  @Get(':id')
  @IsPublic(PublicTypeEnum.PUBLIC)
  getOrder(
    @Param('id', ParseIntPipe) restaurantId: number,
  ) {
    return this.ordersService.getOrderById(restaurantId)
  }

  @Post('allow')
  @Role(RoleTypeEnum.OWNER)
  allowOrder(
    @User() owner: UsersModel,
    @Body() dto: UserOrderDto
  ) {
    console.log('Received DTO:', dto);
    return this.ordersService.allowOrder(dto, owner.id);
  };


  @Post('deliver')
  @Role(RoleTypeEnum.OWNER)
  deliverOrder(
    @User() owner: UsersModel,
    @Body() dto: UserOrderDto
  ) {
    return this.ordersService.deliverOrder(dto, owner.id);
  };



  @Post('complete')
  @Role(RoleTypeEnum.OWNER)
  completeOrder(
    @User() owner: UsersModel,
    @Body() dto: UserOrderDto
  ) {
    return this.ordersService.completeOrder(dto, owner.id);
  }


}
