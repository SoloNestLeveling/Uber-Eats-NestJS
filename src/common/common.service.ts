import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersModel } from 'src/users/entity/users.entity';
import { BasePaginateDto } from './base/paginate.dto.base';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { BaseModel } from './base/entity.base';
import { take } from 'rxjs';

export type THandleValue<T extends BaseModel> = (result: T[]) => T[];

@Injectable()
export class CommonService {

    constructor() { }



    paginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
        handleValues?: THandleValue<T>
    ) {
        if (dto.page) {
            return this.pagePaginate(
                dto,
                repository,
                overriedFindOptions,
            );
        } else {
            return this.cursorPaginate(
                dto,
                repository,
                overriedFindOptions,
                path,
                handleValues
            );
        };
    };


    async cursorPaginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
        handleValues?: THandleValue<T>
    ) {

        const findOptions = this.composeFindOptions<T>(dto);

        const result = await repository.find({
            ...findOptions,
            ...overriedFindOptions,
        });

        const values = handleValues ? handleValues(result) : result

        const lastItem = values.length && dto.take === values.length ? values.at(-1) : null;
        const nextUrl = lastItem ? new URL(`http://localhost:3000/${path}`) : null;

        if (nextUrl) {

            for (const key of Object.keys(dto)) {

                if (dto[key]) {

                    if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {

                        nextUrl.searchParams.append(key, dto[key])
                    };
                };
            }

            let key = null;

            if (dto.order__createdAt === 'ASC') {
                key = 'where__id__more_than';
            } else {
                key = 'where__id__less_than';
            };

            nextUrl.searchParams.append(key, lastItem.id.toString());
        };


        return {
            data: values,
            cursor: {
                after: lastItem?.id.toString() ?? null
            },
            take: dto.take,
            nextUrl: nextUrl?.toString() ?? null
        };

    };



    async pagePaginate<T extends BaseModel>(
        dto: BasePaginateDto,
        repository: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
    ) {
        const findOptions = this.composeFindOptions<T>(dto);
        const [values, count] = await repository.findAndCount({
            ...findOptions,
            ...overriedFindOptions
        });


        return {
            data: values,
            total: count
        }
    }



    parseWhereAndOrderFilter<T extends BaseModel>(key: string, value: any): FindOptionsWhere<T> | FindOptionsOrder<T> {

        let options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};

        const split = key.split('__');

        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException(`split 적용시 길이는 반드시 2또는 3이어야 합니다. 잘못된 키값:${key}`)
        };


        if (split.length === 2) {
            const [_, field] = split; // order__createdAt

            options[field] = value;
        };


        if (split.length === 3) {

            const [_, field, operator] = split;

            if (operator === 'i_like') {

                options[field] = FILTER_MAPPER[operator](`%${value}%`)

            } else {
                options[field] = FILTER_MAPPER[operator](value)
            }
        };

        return options;

    };


    composeFindOptions<T extends BaseModel>(dto: BasePaginateDto): FindManyOptions<T> {

        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};


        for (const [key, value] of Object.entries(dto)) {


            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereAndOrderFilter(key, value)
                };
            }

            if (key.startsWith('order__')) {

                order = {
                    ...order,
                    ...this.parseWhereAndOrderFilter(key, value)
                };
            }
        };

        console.log(where)

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null
        };

    };


};
