import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';
import { debug as _debug } from 'debug';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import * as path from 'path';

dotenv.config();

const debug = _debug('jest-sqlite:environment:custom');

export default class TestEnvironment extends NodeEnvironment {
  testFilePath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    debug('standalone TestEnvironment.constructor');

    this.testFilePath = context.testPath;

    debug('this.testFilePath', this.testFilePath);
  }

  /**
   * Important steps:
   * - Copy template database file as a test database file
   * - Set environment variables of the isolated test context to values required to connect to the test database
   */
  override async setup() {
    await super.setup();

    debug('standalone TestEnvironment.setup');

    const templateDatabaseFilepath = process.env['DB_DATABASE_FILEPATH']!;
    const testDatabaseFolder = process.env['DB_TEST_DATABASE_FOLDER']!;
    debug('templateDatabaseFilepath', templateDatabaseFilepath);
    debug('testDatabaseFolder', testDatabaseFolder);

    /**
     * Requirements for the SQLite DB filename are based on the underlying
     * filesystem's filename constraints.
     *
     * MD5 hash in a hexadecimal format is 32 characters long and contains only
     * ASCII letters and numbers, so it should be a valid DB filename on all
     * major operating systems.
     */
    const testDatabaseFilename =
      'db_test_' + createHash('md5').update(this.testFilePath).digest('hex') + '.sqlite';
    const testDatabaseFilepath = path.join(testDatabaseFolder, testDatabaseFilename);

    try {
      await fs.stat(templateDatabaseFilepath);
    } catch (e: unknown) {
      const error = e as any;
      if (error?.code === 'ENOENT') {
        const errorMessage = `ERROR: Template database file does not exist: ${templateDatabaseFilepath}`;
        debug(errorMessage);
      }

      debug(error.message)
      throw e;
    }
    /**
     * Copied data will be deleted in the `setupFilesAfterEnv` `beforeEach` hook
     */
    await fs.copyFile(templateDatabaseFilepath, testDatabaseFilepath);

    /**
     * When DB__* environment variables are set via process.env here,
     * tests do not see this change because they run inside the
     * `this.global` vm context that is isolated from the global Node.js
     * context. Only environment variables present in the global Node.js
     * context (process.env) at the time of isolated context creation are
     * available to the tests.
     *
     * this.global allows to access isolated context used for running tests.
     */
    this.global.process.env['DB_DATABASE_FILEPATH'] = testDatabaseFilepath;

    debug('process.env[DB_DATABASE_FILEPATH]', process.env['DB_DATABASE_FILEPATH']);
    debug(
      'this.global.process.env[DB_DATABASE_FILEPATH]',
      this.global.process.env['DB_DATABASE_FILEPATH'],
    );
  }

  /**
   * Important steps:
   * - Delete the test database file from the filesystem
   */
  override async teardown() {
    debug('standalone TestEnvironment.teardown - before super');
    await super.teardown();
    debug('standalone TestEnvironment.teardown - after super');

    debug(
      "this.global.process.env['DB_DATABASE_FILEPATH']",
      this.global.process.env['DB_DATABASE_FILEPATH'],
    );

    const testDatabaseFilepath = this.global.process.env['DB_DATABASE_FILEPATH']!;

    try {
      await fs.stat(testDatabaseFilepath);
    } catch (e: unknown) {
      const error = e as any;
      let originalErrorMessage = error.message;
      if (error?.code === 'ENOENT') {
        const errorMessage = `ERROR: Test database file does not exist: ${testDatabaseFilepath}`;
        debug(errorMessage);
        error.message = errorMessage;
      }

      debug(originalErrorMessage)
      throw e;
    }

    await fs.unlink(testDatabaseFilepath);
  }

  override getVmContext() {
    /* A lot of calls... */
    // debug('standalone TestEnvironment.getVmContext');
    return super.getVmContext();
  }
}
