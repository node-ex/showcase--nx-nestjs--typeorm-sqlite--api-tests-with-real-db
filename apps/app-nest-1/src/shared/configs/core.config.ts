import { registerAs } from '@nestjs/config';
import { z, ZodType } from 'zod';
import { validateEnvVars } from './validate.utils';

/**
 * ###########
 * ### Env ###
 * ###########
 */

const CORE_ENV_VAR_NAMES = {
  DB_DATABASE_FILEPATH: 'DB_DATABASE_FILEPATH',
  DB_SYNCHRONIZE: 'DB_SYNCHRONIZE',
} as const;

type CoreEnvVarNames = keyof typeof CORE_ENV_VAR_NAMES;

const CoreEnvVarsSchema = z.object({
  DB_DATABASE_FILEPATH: z.string(),
  DB_SYNCHRONIZE: z
    .string()
    .refine((value) => ['true', 'false'].includes(value), {
      message: 'DB_SYNCHRONIZE must be true or false',
    }),
} satisfies Record<CoreEnvVarNames, ZodType<any, any>>);

export function validateCoreEnvVars(env: Record<string, string | undefined>) {
  return validateEnvVars(CoreEnvVarsSchema, env);
}

/**
 * ##############
 * ### Config ###
 * ##############
 */

const CORE_CONFIG_NAMESPACE = 'core';

const CoreConfigSchema = z.object({
  db: z.object({
    databaseFilepath: z.string(),
    synchronize: z.boolean(),
  }),
});

type CoreConfig = z.infer<typeof CoreConfigSchema>;

export interface NamespacedCoreConfig {
  [CORE_CONFIG_NAMESPACE]: CoreConfig;
}

export const coreConfig = registerAs(
  CORE_CONFIG_NAMESPACE,
  () =>
    ({
      db: {
        databaseFilepath: process.env[CORE_ENV_VAR_NAMES.DB_DATABASE_FILEPATH]!,
        synchronize: process.env[CORE_ENV_VAR_NAMES.DB_SYNCHRONIZE] === 'true',
      },
    } satisfies CoreConfig),
);

export function isStringParsableToInteger(value: string): boolean {
  return /^\d+$/.test(value);
}
