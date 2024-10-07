import { IsNumber } from "class-validator";

export class UserOrderDto {

    @IsNumber()
    orderId: number;
}