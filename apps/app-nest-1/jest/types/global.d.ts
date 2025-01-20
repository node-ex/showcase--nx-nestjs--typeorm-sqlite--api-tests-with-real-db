import type { DataSource } from 'typeorm';
import type { Client } from 'pg';
import type { Database } from 'better-sqlite3';

declare global {
  /**
   * Available in the global Node.js context
   */
  // eslint-disable-next-line no-var
  var __GLOBAL_TYPEORM_DATA_SOURCE_TEMPLATE_DATABASE__: DataSource;

  /**
   * Available in the test environment class
   */
  // eslint-disable-next-line no-var
  var __TEST_ENVIRONMENT_BETTER_SQLITE3_DATABASE_SYSTEM_DATABASE__: Database;

  /**
   * Available in the isolated test context
   */
  // eslint-disable-next-line no-var
  var __TYPEORM_DATA_SOURCE_TEST_DATABASE__: DataSource;
  // eslint-disable-next-line no-var
  var __BETTER_SQLITE3_DATABASE_TEST_DATABASE__: Database;
}

export {};
