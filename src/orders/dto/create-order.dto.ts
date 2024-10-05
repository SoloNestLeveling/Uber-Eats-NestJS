import { PickType } from "@nestjs/mapped-types";
import { OrdersModel } from "../entity/orders.entity";

export class CreateOrderDto extends PickType(OrdersModel, [
    'orderer',
    'phone',
    'address',
    'menus',
    'status'
]) { };