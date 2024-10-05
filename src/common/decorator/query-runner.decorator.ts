import { BadRequestException, createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

export const ReqQueryRunner = createParamDecorator((data, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest()

    if (!req.qr) {
        throw new BadRequestException("반드시 TransactionInterceptor와 함께 사용해야합니다.")
    };

    return req.qr;
});