import { registerAs } from '@nestjs/config';
import { z, ZodType } from 'zod';
import { validateEnvVars } from './validate.utils';

/**
 * ###########
 * ### Env ###
 * ###########
 */

const CORE_ENV_VAR_NAMES = {
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
  DB_SYNCHRONIZE: 'DB_SYNCHRONIZE',
} as const;

type CoreEnvVarNames = keyof typeof CORE_ENV_VAR_NAMES;

const CoreEnvVarsSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().refine((value) => isStringParsableToInteger(value), {
    message: 'DB_PORT must be an integer',
  }),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
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
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
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
        host: process.env[CORE_ENV_VAR_NAMES.DB_HOST]!,
        port: parseInt(process.env[CORE_ENV_VAR_NAMES.DB_PORT]!),
        username: process.env[CORE_ENV_VAR_NAMES.DB_USERNAME]!,
        password: process.env[CORE_ENV_VAR_NAMES.DB_PASSWORD]!,
        database: process.env[CORE_ENV_VAR_NAMES.DB_DATABASE]!,
        synchronize: process.env[CORE_ENV_VAR_NAMES.DB_SYNCHRONIZE] === 'true',
      },
    } satisfies CoreConfig),
);

export function isStringParsableToInteger(value: string): boolean {
  return /^\d+$/.test(value);
}
