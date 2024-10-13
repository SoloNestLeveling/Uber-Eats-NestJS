import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleTypeEnum, UsersModel } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRespository: Repository<UsersModel>
    ) { }




    async createUser(dto: CreateUserDto) {

        const { name, email, password, phoneNumber, address } = dto

        const existEmail = await this.usersRespository.exists({
            where: {
                email,
            },
        });

        if (existEmail) {
            throw new BadRequestException("이미 존재 하는 이메일 입니다.")
        };


        const user = this.usersRespository.create({
            name,
            email,
            password,
            phoneNumber,
            address,
        });

        const restult = await this.usersRespository.save(user);


        return restult;
    };


    async getUserById(id: number) {

        const user = await this.usersRespository.findOne({
            where: {
                id,
            },
            relations: [
                'profile',
                'profile.image',
                'restaurant',
                'restaurant.menus',
                'wishlist',
                'orders',]
        });

        return user;
    };




    async getUserByEmail(email: string) {

        const user = await this.usersRespository.findOne({
            where: {
                email,
            }
        });

        return user;
    };



    async getOwnerById(id: number) {

        const user = await this.usersRespository.findOne({
            where: {
                role: RoleTypeEnum.OWNER,
                id,
            },
            relations: ['restaurant', 'restaurant.orders', 'restaurant.orders.user', 'orders', 'wishlist']

        });

        return user;
    };


    async deletHistory(id: number) {

        const user = await this.getUserById(id);

        user.orderHistory = [];

        await this.usersRespository.save(user);

        return user;
    }
}
