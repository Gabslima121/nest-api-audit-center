import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { ApiModule } from './api/api.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ConfigModule.forRoot({ isGlobal: true }),
    ApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
