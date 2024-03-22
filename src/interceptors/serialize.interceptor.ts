import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        console.log('Running before handler', context);
        return handler.handle().pipe(
            map((data: any) => {
                console.log('Running before response is sent out', data);
                // return data;
            })
        )
    }
}