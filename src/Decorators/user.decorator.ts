import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

export interface UserDecorator {

}
export const User = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): UserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user.id;
    },
);
