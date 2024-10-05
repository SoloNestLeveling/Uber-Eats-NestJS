import { IsIn, IsNumber, IsOptional } from "class-validator";
import { Column } from "typeorm";


export class BasePaginateDto {

    @IsNumber()
    @IsOptional()
    where__id__more_than?: number;

    @IsNumber()
    @IsOptional()
    where__id__less_than?: number;


    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt: 'ASC' | 'DESC' = 'ASC';

    @IsNumber()
    @IsOptional()
    take: number = 10;

    @IsNumber()
    @IsOptional()
    page?: number;


}