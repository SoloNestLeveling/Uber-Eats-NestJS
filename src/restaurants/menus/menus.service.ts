import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenusModel } from "./entity/menus.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { CreateMeunDto } from "./dto/create-menu.dto";
import { MenusPaginateDto } from "./dto/menu-paginate.dto";
import { CommonService, THandleValue } from "src/common/common.service";
import { RestaurantsService } from "../restaurants.service";

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(MenusModel)
        private readonly menusRepository: Repository<MenusModel>,
        private readonly usersService: UsersService,
        private readonly commonService: CommonService,
        private readonly restaurantsService: RestaurantsService
    ) { }


    async createMenu(dto: CreateMeunDto, ownerId: number) {

        const owner = await this.usersService.getUserById(ownerId);

        const restaurant = owner.restaurant;

        console.log(restaurant.id)


        const menu = this.menusRepository.create({
            restaurant: {
                id: restaurant.id
            },
            name: dto.name,
            price: dto.price
        });

        const result = await this.menusRepository.save(menu);

        return result;
    };



    async menusPaginate(dto: MenusPaginateDto, restaurantId: number) {


        const handleMenus: THandleValue<MenusModel> = (result: MenusModel[]) => {

            const menus = result.filter((menu) => menu.restaurant?.id === restaurantId);

            return menus;

        };


        return this.commonService.paginate(
            dto,
            this.menusRepository,
            {
                relations: ['restaurant']
            },
            'menus',
            handleMenus,
        )
    };
};