import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
@Injectable()
class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async createUser({
    name,
    avatar,
    cpf,
    email,
    isDeleted,
    password,
  }: CreateUserDTO): Promise<User> {
    const user = new User();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await this.checkIfUserExists(email, cpf);

    const hashedPassword = await hash(password, 12);

    user.name = name;
    user.avatar = avatar || '';
    user.cpf = cpf;
    user.email = email;
    user.isDeleted = isDeleted || false;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async checkIfUserExists(email: string, cpf: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const cpfExists = await this.userRepository.findOne({
      where: {
        cpf,
      },
    });

    if (user || cpfExists) {
      throw new Error('User already exists. Please try another email or cpf');
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
export { UserService };
