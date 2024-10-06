import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IWishlistMenus, WishlistModel } from "./entity/wishlist.entity";
import { Repository } from "typeorm";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { UsersService } from "../users.service";
import { MenusService } from "src/restaurants/menus/menus.service";

@Injectable()
export class WishlistService {

    constructor(
        @InjectRepository(WishlistModel)
        private readonly wishlistRespository: Repository<WishlistModel>,
        private readonly restaurantsService: RestaurantsService,
        private readonly usersService: UsersService,
        private readonly menusService: MenusService,

    ) { }


    async createWishlist(dto: CreateWishlistDto, userId: number, restaurantId: number) {



        const wishlist = this.wishlistRespository.create({
            user: {
                id: userId
            },
            menus: [],
            totalPrice: dto.totalPrice
        });


        const orderMenus = await this.getOrderMenu(dto, restaurantId)

        console.log(orderMenus)

        wishlist.menus.push(...orderMenus)

        const prices = wishlist.menus.map((a) => a.price);

        const numPrices = prices.map((a) => +a.replace('원', ''));

        const total = numPrices.reduce((p, c) => p + c);

        wishlist.totalPrice = `${total}원`


        const result = await this.wishlistRespository.save(wishlist);

        return result;

    };



    async getwishlistById(id: number) {

        const list = await this.wishlistRespository.findOne({
            where: {
                id,
            },
            relations: ['user']
        });

        return list;
    };




    async getOrderMenu(dto: CreateWishlistDto, resId: number) {

        const orderMenus = Promise.all(dto.menuNumbers.map(async (a) => {

            return await this.menusService.getMenuByResId(a, resId)
        }));


        return (await orderMenus).map((a) => ({
            name: a.name,
            price: a.price
        }))

    };
}