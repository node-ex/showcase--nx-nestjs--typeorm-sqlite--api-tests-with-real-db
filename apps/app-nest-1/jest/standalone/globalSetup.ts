import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';
import * as path from 'path';
import { promises as fs } from 'fs';

const debug = _debug('jest-sqlite:setup:custom');

/**
 * Needed, because `process.cwd()` returns the absolute path to the directory
 * containing the current NX project
 */
const CWD_SUFFIX = '../../';

/**
 * Important steps:
 * - Set path-related environment variables of the global Node.js context to
 *   absolute path values
 */
export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  /** For outputting next debug message on a new line */
  debug('');
  debug('standalone setup.ts');

  const templateDatabaseFilepath = process.env['DB_DATABASE_FILEPATH']!;
  const testDatabaseFolder = process.env['DB_TEST_DATABASE_FOLDER']!;
  const absoluteTemplateDatabaseFilepath = path.join(process.cwd(), CWD_SUFFIX, templateDatabaseFilepath);
  const absoluteTestDatabaseFolder = path.join(process.cwd(), CWD_SUFFIX, testDatabaseFolder);

  debug('absoluteTemplateDatabaseFilepath', absoluteTemplateDatabaseFilepath);
  debug('absoluteTestDatabaseFolder', absoluteTestDatabaseFolder);

  process.env['DB_DATABASE_FILEPATH'] = absoluteTemplateDatabaseFilepath;
  process.env['DB_TEST_DATABASE_FOLDER'] = absoluteTestDatabaseFolder;

  /*
   * Files are deleted in the setup and not in the teardown to delete data
   * that was not deleted during the previous test run, e.g. due to process
   * failure which led to process exiting before the teardown hooks were run.
   */
  const testDatabaseFilenames = await fs.readdir(absoluteTestDatabaseFolder);
  for (const filename of testDatabaseFilenames) {
    if (!filename.startsWith('db_test_')) {
      continue;
    }

    await fs.unlink(path.join(absoluteTestDatabaseFolder, filename));
  }
};
