import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel, ProgressStatusTypeEnum } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UserOrderDto } from './dto/allow-order.dto';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>,
        private readonly usersService: UsersService,
        private readonly restaurantsService: RestaurantsService

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



    async allowOrder(dto: UserOrderDto, restaurantId: number) {


        const restaurant = await this.restaurantsService.getRestaurantById(restaurantId)


        const order = restaurant.orders.filter((a) => a.id === dto.orderId);

        order.forEach((a) => {
            switch (a.status) {
                case ProgressStatusTypeEnum.PENDING:
                    a.status = ProgressStatusTypeEnum.COOKING;
                    break;

                default:
                    throw new BadRequestException(`현재 주문의 상태는 ${a.status}입니다.`)
            }
        });


        return this.ordersRepository.save(order);
    };



    async deliverOrder(dto: UserOrderDto, restaurantId: number) {


        const restaurant = await this.restaurantsService.getRestaurantById(restaurantId)


        const order = restaurant.orders.filter((a) => a.id === dto.orderId);

        order.forEach((a) => {
            switch (a.status) {
                case ProgressStatusTypeEnum.COOKING:
                    a.status = ProgressStatusTypeEnum.DELIVERING;
                    break;

                default:
                    throw new BadRequestException(`현재 주문의 상태는 ${a.status}입니다.`)
            }
        });


        return this.ordersRepository.save(order);
    };




    async completeOrder(dto: UserOrderDto, restaurantId: number) {


        const restaurant = await this.restaurantsService.getRestaurantById(restaurantId)


        const order = restaurant.orders.filter((a) => a.id === dto.orderId);

        order.forEach((a) => {
            switch (a.status) {
                case ProgressStatusTypeEnum.DELIVERING:
                    a.status = ProgressStatusTypeEnum.COMPLETE;
                    break;

                default:
                    throw new BadRequestException(`현재 주문의 상태는 ${a.status}입니다.`)
            }
        });


        return this.ordersRepository.save(order);
    };
};
