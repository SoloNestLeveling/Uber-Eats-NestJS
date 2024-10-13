import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne } from "typeorm";
import { ProfileModel } from "../profile/entity/profile.entity";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { IOrderMenus, OrdersModel } from "src/orders/entity/orders.entity";
import { WishlistModel } from "../wishlist/entity/wishlist.entity";
import { Exclude, Expose, Transform } from "class-transformer";


export enum RoleTypeEnum {
    ADMIN = "ADMIN",
    USER = "USER",
    OWNER = "OWNER",
};

interface IHistory {
    menus: IOrderMenus[],
    totalPrice: string,
};


@Entity()
@Exclude()
export class UsersModel extends BaseModel {

    @Column()
    @IsString()
    @Expose()
    name: string;

    @Column()
    @IsEmail()
    @Expose()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    @Expose()
    phoneNumber: string;

    @Column()
    @IsString()
    @Expose()
    address: string;

    @Column({ default: RoleTypeEnum.USER })
    @IsEnum(RoleTypeEnum)
    @Expose()
    role: RoleTypeEnum;


    @Column('jsonb', { default: [] })
    @IsString()
    @IsOptional()
    @Expose()
    orderHistory?: IHistory[];


    @Column({ default: 0 })
    @Transform(({ obj, value }) => obj.role === RoleTypeEnum.OWNER ? value : undefined)
    @IsString()
    @Expose()
    todayTotal: number;



    @OneToOne(() => ProfileModel, (profile) => profile.user)
    @JoinColumn()
    @Expose()
    profile: ProfileModel;


    @OneToOne(() => RestaurantsModel, (res) => res.owner)
    @JoinColumn()
    @Expose()
    restaurant: RestaurantsModel;


    @OneToMany(() => OrdersModel, (order) => order.user)
    @Expose()
    orders: OrdersModel[];


    @OneToOne(() => WishlistModel, (list) => list.user)
    @JoinColumn()
    @Expose()
    wishlist: WishlistModel;

};