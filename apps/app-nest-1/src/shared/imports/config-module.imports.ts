import { ConfigModule } from '@nestjs/config';
import { coreConfig, validateCoreEnvVars } from '../configs/core.config';

export const configModuleImports = [
  ConfigModule.forRoot({
    load: [coreConfig],
    validate: validateCoreEnvVars,
    // No need to import in other modules
    isGlobal: true,
    expandVariables: true,
    // cache: true,
  }),
];
