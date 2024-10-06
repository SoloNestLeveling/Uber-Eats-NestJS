import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>,
        private readonly usersService: UsersService

    ) { }




    async createOrder(dto: CreateOrderDto, userId: number, restaurantId: number) {

        const orderer = await this.usersService.getUserById(userId);
        const orderMenus = orderer.wishlist.menus


        const order = this.ordersRepository.create({
            user: {
                id: userId
            },
            restaurant: {
                id: restaurantId
            },
            orderer: orderer.name || dto.orderer,
            phone: orderer.phoneNumber || dto.phone,
            address: orderer.address || dto.address,
            menus: [...orderMenus],
            status: dto.status

        });


        const result = await this.ordersRepository.save(order);

        return result;

    };


    async getOrderById(id: number) {

        const order = await this.ordersRepository.findOne({
            where: {
                id,
            },
            relations: ['user', 'restaurant']
        });

        return order;
    };

};
