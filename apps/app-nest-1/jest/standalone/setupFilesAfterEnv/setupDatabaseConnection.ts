import { Test } from '@nestjs/testing';
import { configModuleImports } from '../../../src/shared/imports/config-module.imports';
import { typeOrmModuleImports } from '../../../src/shared/imports/typeorm-module.imports';
import { DataSource } from 'typeorm';
import { debug as _debug } from 'debug';
import Database from 'better-sqlite3';

const debug = _debug(
  'jest-sqlite:setupFilesAfterEnv:setupDatabaseConnection',
);

/**
 * Important steps:
 * - Create a new NestJS app for accessing the TypeORM DataSource
 * - Retrieve the initialized TypeORM DataSource for the test database from the app's DI container
 * - Store a reference to the TypeORM DataSource for the test database in globalThis
 * - Create and connect a new better-sqlite3 Database for the test database
 * - Store a reference to the better-sqlite3 Database for the test database in globalThis
 */
beforeAll(async () => {
  /**
   * Create a new NestJS application with the TypeOrmModule that uses
   * environment variable values set in the testEnvironment.ts file.
   */
  const app = await Test.createTestingModule({
    imports: [...configModuleImports, ...typeOrmModuleImports],
  }).compile();

  const dataSource = app.get(DataSource);
  debug('dataSource.isInitialized', dataSource.isInitialized);
  globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__ = dataSource;

  const testDatabaseFilepath = process.env['DB_DATABASE_FILEPATH']!;
  debug('testDatabaseFilepath', testDatabaseFilepath);

  const database = new Database(testDatabaseFilepath, {
    verbose: console.log,
    fileMustExist: false,
  });

  globalThis.__BETTER_SQLITE3_DATABASE_TEST_DATABASE__ = database;
});

/**
 * Important steps:
 * - Delete all data from all tables in the test database
 */
beforeEach(async () => {
  debug('deleting data from all tables');

  const dataSource = globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__;

  const { foreign_keys: foreignKeysPragmaValue } = (
    await dataSource.query('PRAGMA foreign_keys;')
  )[0];
  await dataSource.query('PRAGMA foreign_keys=0;');

  const tables = await dataSource.query(
    'SELECT name FROM sqlite_master WHERE type="table" ORDER BY name;'
  );

  /*
   * Data is deleted from all tables in the beforeEach hook and not in the
   * afterEach hook to delete data copied from the template database before
   * the first test is run.
   */
  for (const table of tables) {
    await dataSource.query(`DELETE FROM ${table.name};`);
  }

  await dataSource.query(`PRAGMA foreign_keys=${foreignKeysPragmaValue};`);

  debug('data deleted from all tables');
});

/**
 * Important steps:
 * - Destroy the TypeORM DataSource for the test database
 * - Close the better-sqlite3 Database for the test database
 */
afterAll(async () => {
  await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.destroy();
  globalThis.__BETTER_SQLITE3_DATABASE_TEST_DATABASE__.close();
});
