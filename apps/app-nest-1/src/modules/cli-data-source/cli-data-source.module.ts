import { Module } from '@nestjs/common';
import { configModuleImports } from '../../shared/imports/config-module.imports';
import { DataSourceModule } from '../data-source/data-source.module';

/**
 * This module should only be used by the `./src/cli-data-source.ts`
 * entrypoint file.
 */
@Module({
  imports: [...configModuleImports, DataSourceModule],
})
export class CliDataSourceModule {}
