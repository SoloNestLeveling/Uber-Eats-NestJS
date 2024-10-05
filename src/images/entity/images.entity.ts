import { IsEnum, IsIn, IsInt, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ImagesTypeEnum } from "../enum/images.enum";
import { Transform } from "class-transformer";
import { join } from "path";
import { PUBLIC_MENU_IMAGE_PATH, PUBLIC_PROFILE_IMAGE_PATH } from "src/common/const/image-path.const";
import { UsersModel } from "src/users/entity/users.entity";
import { ProfileModel } from "src/users/profile/entity/profile.entity";
import { MenusModel } from "src/restaurants/menus/entity/menus.entity";

@Entity()
export class ImagesModel extends BaseModel {

    @Column()
    @IsInt()
    order: number;


    @Column({ default: ImagesTypeEnum.PROFILE })
    @IsEnum(ImagesTypeEnum)
    type: ImagesTypeEnum;


    @Column()
    @IsString()
    @Transform(({ value, obj }) => {
        if (obj.type === ImagesTypeEnum.PROFILE) {
            return `/${join(PUBLIC_PROFILE_IMAGE_PATH, value)}`
        } else {
            return `/${join(PUBLIC_MENU_IMAGE_PATH, value)}`
        }
    })
    path: string;



    @OneToOne(() => ProfileModel, (user) => user.image)
    @JoinColumn()
    profile: ProfileModel


    @OneToOne(() => MenusModel, (menu) => menu.image)
    @JoinColumn()
    menu: MenusModel
}