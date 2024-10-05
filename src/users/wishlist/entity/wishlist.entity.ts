import { IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToMany } from "typeorm";

interface IWishlistMenus {

    name: string;
    price: string;
}

@Entity()
export class WishlistModel extends BaseModel {

    @Column('jsonb', { default: [] })
    @IsString()
    @IsOptional()
    list: IWishlistMenus[];


    @ManyToMany(() => UsersModel, (user) => user.wishlist)
    user: UsersModel;
}