import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../entity/users.entity";

export class CreateUserDto extends PickType(UsersModel, [
    'name',
    'email',
    'password',
    'phoneNumber',
    'address'
]) { }