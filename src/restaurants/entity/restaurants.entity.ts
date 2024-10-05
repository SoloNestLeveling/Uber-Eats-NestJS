import { IsEnum, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { MenusModel } from "../menus/entity/menus.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { OrdersModel } from "src/orders/entity/orders.entity";


export enum CategoryTypeEnum {

    돈까스_회_일식 = "돈까스,회,일식",
    피자 = "피자",
    치킨 = "치킨",
    아시안 = "아시안",
    족발_보쌈 = "족발,보쌈"
}

@Entity()
export class RestaurantsModel extends BaseModel {


    @Column()
    @IsString()
    name: string;


    @Column({ default: "선택" })
    @IsEnum(CategoryTypeEnum)
    category: CategoryTypeEnum;


    @OneToMany(() => MenusModel, (menu) => menu.restaurant)
    menus: MenusModel[]

    @OneToOne(() => UsersModel, (user) => user.restaurant)
    owner: UsersModel;

    @OneToMany(() => OrdersModel, (order) => order.restaurant)
    orders: OrdersModel[];
};