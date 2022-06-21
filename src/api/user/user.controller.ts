import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post('create')
  async createUser(
    @Body() { cpf, email, name, password }: CreateUserDTO,
  ): Promise<User> {
    try {
      return this.userService.createUser({
        cpf,
        email,
        name,
        password,
      });
    } catch (error) {
      return error;
    }
  }
}
