import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

interface IOrderMenus {
    name: string,
    price: string,
};

export enum ProgressStatusTypeEnum {

    PENDING = "pending",
    COOKING = 'cooking',
    DELIVERING = 'delivering',
    COMPLETE = 'complete'
};


@Entity()
export class OrdersModel extends BaseModel {

    @Column()
    @IsString()
    @IsOptional()
    orderer?: string;

    @Column()
    @IsString()
    @IsOptional()
    phone?: string;

    @Column()
    @IsString()
    @IsOptional()
    address?: string;


    @Column('jsonb', { default: [] })
    @IsString()
    @IsOptional()
    menus: IOrderMenus[];


    @Column({ default: ProgressStatusTypeEnum.PENDING })
    @IsEnum(ProgressStatusTypeEnum)
    @IsOptional()
    status: ProgressStatusTypeEnum;


    @ManyToOne(() => UsersModel, (user) => user.orders)
    user: UsersModel;

    @ManyToOne(() => RestaurantsModel, (res) => res.orders)
    restaurant: RestaurantsModel;

};