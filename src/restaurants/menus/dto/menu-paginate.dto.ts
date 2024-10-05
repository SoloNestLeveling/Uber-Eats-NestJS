import { IsOptional, IsString } from "class-validator";
import { BasePaginateDto } from "src/common/base/paginate.dto.base";

export class MenusPaginateDto extends BasePaginateDto {

    @IsString()
    @IsOptional()
    where__name__i_like?: string;
}