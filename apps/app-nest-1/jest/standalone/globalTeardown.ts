import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';

const debug = _debug('jest-sqlite:teardown:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  debug('standalone teardown.ts');
};
