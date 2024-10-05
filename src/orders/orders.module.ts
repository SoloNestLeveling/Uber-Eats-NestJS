import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersModel,
    ])
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
