import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Param,
  HttpException,
} from '@nestjs/common';

import { CreateUserDTO, FindUserByEmailDTO } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post('create')
  async createUser(
    @Body() { cpf, email, name, password, roleId }: CreateUserDTO,
  ) {
    try {
      return await this.userService.createUser({
        cpf,
        email,
        name,
        password,
        roleId,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('by-email')
  async getUserByEmail(@Body() { email }: FindUserByEmailDTO) {
    try {
      return this.userService.getUserByEmail({ email });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  async listAllUsers(): Promise<User[]> {
    try {
      return this.userService.getAllUsers();
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:id')
  async getUserById(@Param() id: string): Promise<User | object> {
    try {
      return this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
