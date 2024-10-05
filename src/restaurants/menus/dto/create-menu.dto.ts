import { PickType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { MenusModel } from "../entity/menus.entity";

export class CreateMeunDto extends PickType(MenusModel, ['name', 'price']) {
}