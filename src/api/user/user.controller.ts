import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Param,
  HttpException,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateUserDTO, FindUserByEmailDTO, UpdateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('me')
  getUserByToken(@CurrentUser() user: User): User {
    console.log(user);
    return user;
  }

  @Post('create')
  async createUser(
    @Body()
    { cpf, email, name, password, roleId, companyId, avatar }: CreateUserDTO,
  ) {
    try {
      return await this.userService.createUser({
        cpf,
        email,
        name,
        password,
        roleId,
        avatar,
        companyId,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('by-email')
  async getUserByEmail(@Body() { email }: FindUserByEmailDTO) {
    try {
      return await this.userService.getUserByEmail({ email });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  async listAllUsers(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:id')
  async getUserById(@Param() id: string): Promise<User | object> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Put('update/:userId')
  async updateUser(
    @Body() { email, name }: UpdateUserDTO,
    @Param() { userId }: UpdateUserDTO,
  ): Promise<object | void> {
    try {
      return await this.userService.updateUser({ userId, email, name });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
