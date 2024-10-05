import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>

    ) { }


}
