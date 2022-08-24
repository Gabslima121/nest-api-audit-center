import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      migrationsRun: true,
      host: this.config.get('DATABASE_HOST'),
      port: this.config.get('DATABASE_PORT'),
      database: this.config.get('DATABASE_NAME'),
      username: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/database/migrations/*.{ts,js}'],
      logging: true,
      cli: {
        migrationsDir: 'src/database/migrations',
      },
      // extra: {
      //   ssl: true,
      // },
    };
  }
}
