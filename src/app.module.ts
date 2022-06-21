import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';

import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ConfigModule.forRoot({ isGlobal: true }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
