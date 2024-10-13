import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel, ProgressStatusTypeEnum } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UserOrderDto } from './dto/allow-order.dto';
import { UsersModel } from 'src/users/entity/users.entity';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
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



    async allowOrder(dto: UserOrderDto, ownerId: number) {

        const owner = await this.usersService.getOwnerById(ownerId);

        if (!owner) {
            throw new BadRequestException("owner가 존재하지 않습니다.")
        }


        const restaurant = owner.restaurant;

        console.log(restaurant)

        const order = restaurant.orders.filter((a) => a.id === dto.orderId);

        if (!order) {
            throw new BadRequestException('order가 존재하지 않습니다.')
        }

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



    async deliverOrder(dto: UserOrderDto, ownerId: number) {

        const owner = await this.usersService.getOwnerById(ownerId);

        if (!owner) {
            throw new BadRequestException("owner가 존재하지 않습니다.")
        }


        const restaurant = owner.restaurant;


        const order = restaurant.orders.find((o) => o.id === dto.orderId);

        switch (order.status) {
            case ProgressStatusTypeEnum.COOKING:
                order.status = ProgressStatusTypeEnum.DELIVERING;
                break;

            default:
                throw new BadRequestException(`현재 주문의 상태는 ${order.status}입니다.`)
        };


        return this.ordersRepository.save(order);
    };




    async completeOrder(dto: UserOrderDto, ownerId: number) {

        const owner = await this.usersService.getOwnerById(ownerId);

        if (!owner) {
            throw new BadRequestException("owner가 존재하지 않습니다.")
        }


        const restaurant = owner.restaurant;


        const order = restaurant.orders.find((a) => a.id === dto.orderId);

        const user = await this.usersService.getUserById(order.user.id)


        switch (order.status) {
            case ProgressStatusTypeEnum.DELIVERING:
                order.status = ProgressStatusTypeEnum.COMPLETE;
                break;

            default:
                throw new BadRequestException(`현재 주문의 상태는 ${order.status}입니다.`)
        }


        owner.orders = owner.orders.filter((o) => o.id !== order.id)
        user.orders = user.orders.filter((o) => o.id !== order.user.id);

        const totalOrderPrice = await this.totalOrderPrice(order.id)

        const newOrderHistory = {
            menus: order.menus,
            totalPrice: `${totalOrderPrice}원`
        };


        owner.orderHistory = [...owner.orderHistory, newOrderHistory];


        user.orderHistory = [...user.orderHistory, newOrderHistory];


        owner.todayTotal += totalOrderPrice;

        await this.usersRepository.save(owner);
        await this.usersRepository.save(user)


        return this.ordersRepository.save(order);
    };




    async totalOrderPrice(orderId: number) {

        const order = await this.getOrderById(orderId);

        const menus = order.menus;
        const prices = menus.map((a) => a.price);

        const numPrices = prices.map((a) => +a.replace('원', ''));

        const totalPrice = numPrices.reduce((p, c) => p + c);

        return totalPrice;
    };


    async addOrderHistory() {

    }
};
