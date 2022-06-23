import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from 'src/api/user/user.entity';
import { AuthRequest } from '../dtos/auth.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
