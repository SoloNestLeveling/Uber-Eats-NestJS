import { PickType } from "@nestjs/mapped-types";
import { RestaurantsModel } from "../entity/restaurants.entity";

export class CreateRestaurantDto extends PickType(RestaurantsModel, ['name', 'category']) { }