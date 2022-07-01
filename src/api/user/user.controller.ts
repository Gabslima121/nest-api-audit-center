import { Body, Controller, Get, Inject, Post, Param } from '@nestjs/common';

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
      console.log(error);
      return { error: error.message };
    }
  }

  @Get('by-email')
  async getUserByEmail(@Body() { email }: FindUserByEmailDTO) {
    try {
      return this.userService.getUserByEmail({ email });
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  @Get()
  async listAllUsers(): Promise<User[]> {
    try {
      return this.userService.getAllUsers();
    } catch (error) {
      return error;
    }
  }

  @Get('/:id')
  async getUserById(@Param() id: string): Promise<User | object> {
    try {
      return this.userService.getUserById(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}
