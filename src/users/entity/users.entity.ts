import { IsEmail, IsEnum, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne } from "typeorm";
import { ProfileModel } from "../profile/entity/profile.entity";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { OrdersModel } from "src/orders/entity/orders.entity";
import { WishlistModel } from "../wishlist/entity/wishlist.entity";

export enum RoleTypeEnum {
    ADMIN = "ADMIN",
    USER = "USER",
    OWNER = "OWNER",
}

@Entity()
export class UsersModel extends BaseModel {

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    phoneNumber: string;

    @Column()
    @IsString()
    address: string;

    @Column({ default: RoleTypeEnum.USER })
    @IsEnum(RoleTypeEnum)
    role: RoleTypeEnum;


    @OneToOne(() => ProfileModel, (profile) => profile.user)
    @JoinColumn()
    profile: ProfileModel;


    @OneToOne(() => RestaurantsModel, (res) => res.owner)
    @JoinColumn()
    restaurant: RestaurantsModel;


    @OneToMany(() => OrdersModel, (order) => order.user)
    orders: OrdersModel[];


    @OneToMany(() => WishlistModel, (list) => list.user)
    wishlist: WishlistModel[];

};