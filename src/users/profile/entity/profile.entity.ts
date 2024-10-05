import { IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class ProfileModel extends BaseModel {

    @Column()
    @IsString()
    nickname: string;


    @OneToOne(() => ImagesModel, (img) => img.profile)
    image: ImagesModel

    @OneToOne(() => UsersModel, (user) => user.profile)
    user: UsersModel
};