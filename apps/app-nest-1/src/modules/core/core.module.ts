import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceService } from '../data-source/services/data-source/data-source.service';
import { DataSourceModule } from '../data-source/data-source.module';
import { configModuleImports } from '../../shared/imports/config-module.imports';
import { HelloWorldModule } from '../hello-world/hello-world.module';
import { TypeormModule } from '../typeorm/typeorm.module';

@Module({
  imports: [
    ...configModuleImports,
    TypeOrmModule.forRootAsync({
      imports: [DataSourceModule],
      useFactory: (dataSourceService: DataSourceService) =>
        dataSourceService.getTypeOrmModuleOptions(),
      inject: [DataSourceService],
    }),
    HelloWorldModule,
    TypeormModule,
  ],
})
export class CoreModule {}
