import { DataSourceOptions } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { coreConfig } from '../../../../shared/configs/core.config';

@Injectable()
export class DataSourceService {
  constructor(
    @Inject(coreConfig.KEY)
    private injectedCoreConfig: ConfigType<typeof coreConfig>,
  ) {}

  getTypeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
      ...this.getDataSourceOptions(),
      autoLoadEntities: true,
    };
  }

  getDataSourceOptions(loadEntitiesUsingPaths = false): DataSourceOptions {
    return {
      type: 'sqlite',
      database: this.injectedCoreConfig.db.databaseFilepath,
      /*
       * This only properly works when running TypeORM CLI commands
       * using ts-node. When running NestJS app using NestJS CLI, JS code would
       * import uncompiled TS code of entities.
       */
      ...(loadEntitiesUsingPaths && {
        entities: [
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'modules',
            '**',
            '*.entity.ts',
          ),
        ],
      }),
      /*
       * Its ok to use paths here, because migrations are run via
       * TypeORM CLI commands using ts-node
       */
      migrations: [
        path.resolve(__dirname, '..', '..', '..', '..', 'migrations', '*.ts'),
      ],
      synchronize: this.injectedCoreConfig.db.synchronize,
    };
  }
}
