import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  @Post(':id')
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
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.ordersService.getOrderById(id)
  }



}
