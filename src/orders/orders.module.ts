import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersModel,
      UsersModel
    ])
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService],
})
export class OrdersModule { }
