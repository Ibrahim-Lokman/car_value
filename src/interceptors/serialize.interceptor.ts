import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "src/users/dtos/user.dto";
import { User } from "src/users/user.entity";

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        console.log('Running before handler', context);
        return handler.handle().pipe(
            map((data: any) => {
                console.log('Running before response is sent out', data);
                // return data;
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}