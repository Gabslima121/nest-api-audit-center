import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateSlaDTO, UpdateSlaDTO } from './sla.dto';
import { SlaService } from './sla.service';

@Controller('sla')
export class SlaController {
  @Inject(SlaService)
  private readonly slaService: SlaService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('create')
  async createSla(
    @Body()
    { company, name, sla, typeSla, description }: CreateSlaDTO,
    @CurrentUser() user: User,
  ) {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.slaService.createSla({
        company,
        name,
        sla,
        typeSla,
        description,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:id')
  async getSlaById(@CurrentUser() user: User, @Param('id') id: string) {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.slaService.findSlaById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/get-sla-by-company/:companyId')
  async getSlaByCompanyId(
    @CurrentUser() user: User,
    @Param('companyId') companyId: string,
  ) {
    try {
      // await this.userService.checkIfUserIsAdmin(user.id);

      return await this.slaService.findSlaByCompanyId(companyId);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Put('update/:id')
  async updateSla(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() { name, sla, typeSla, description }: UpdateSlaDTO,
  ) {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.slaService.updateSla(id, {
        name,
        sla,
        typeSla,
        description,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Delete('delete/:id')
  async deleteSla(@CurrentUser() user: User, @Param('id') id: string) {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.slaService.deleteSla(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
