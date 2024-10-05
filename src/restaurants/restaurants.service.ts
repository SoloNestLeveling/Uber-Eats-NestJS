import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantsModel } from './entity/restaurants.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectRepository(RestaurantsModel)
        private readonly restaurantsRepository: Repository<RestaurantsModel>,
        private readonly commonService: CommonService
    ) { }


    async createRes(dto: CreateRestaurantDto, ownerId: number) {

        const restaurant = this.restaurantsRepository.create({
            owner: {
                id: ownerId
            },
            name: dto.name,
            category: dto.category,
        });


        const result = await this.restaurantsRepository.save(restaurant);

        return result;

    };


    async getRestaurantById(id: number) {

        const restaurant = await this.restaurantsRepository.findOne({
            where: {
                id,
            },
            relations: ['menus']
        });

        return restaurant;
    };

}
