import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Response, Request, NextFunction } from 'express';

import { LoginRequestBody } from 'src/api/auth/dtos/auth.dto';

@Injectable()
class loginValidaitonMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const loginRequestBody = new LoginRequestBody();
    loginRequestBody.email = body.email;
    loginRequestBody.password = body.password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    next();
  }
}

export { loginValidaitonMiddleware };
