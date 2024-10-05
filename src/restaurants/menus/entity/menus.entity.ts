import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class MenusModel extends BaseModel {

    @Column()
    @IsString()
    name: string;


    @Column()
    @IsString()
    price: string;


    @ManyToOne(() => RestaurantsModel, (res) => res.menus)
    @Exclude()
    restaurant: RestaurantsModel;


    @OneToOne(() => ImagesModel, (img) => img.menu)
    image: ImagesModel

};