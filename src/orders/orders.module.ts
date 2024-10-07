import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersModel,
      UsersModel,
      RestaurantsModel
    ])
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, RestaurantsService, CommonService],
})
export class OrdersModule { }
