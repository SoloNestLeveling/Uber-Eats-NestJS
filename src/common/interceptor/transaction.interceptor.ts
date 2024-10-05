import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const req = context.switchToHttp().getRequest()

        const qr = this.dataSource.createQueryRunner();

        req.qr = qr;

        await qr.connect()
        await qr.startTransaction()

        return next.handle()
            .pipe(
                catchError(async () => {

                    await qr.rollbackTransaction()
                    await qr.release()
                    throw new BadRequestException("작업중 에러 발생")
                }),

                tap(async () => {
                    await qr.commitTransaction()
                    await qr.release()
                }),
            );

    };
};