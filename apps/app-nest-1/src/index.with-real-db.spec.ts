import { debug as _debug } from 'debug';

const debug = _debug('jest-sqlite:test');

describe('Index', () => {
  it('test1', async () => {
    debug('test1');
    debug("process.env['DB_DATABASE_FILEPATH']", process.env['DB_DATABASE_FILEPATH']);
    debug(
      'globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.driver.version',
      globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.driver.version,
    );

    await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.query(
      'INSERT INTO coffees (name, brand) VALUES (?, ?)',
      ['Coffee 1', 'Brand 1'],
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const coffees = await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.query(
      'SELECT * FROM coffees',
    );
    debug('coffees', coffees);

    expect(true).toBe(true);
  });

  it('test2', async () => {
    debug('test2');
    await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.query(
      'INSERT INTO coffees (name, brand) VALUES (?, ?)',
      ['Coffee 2', 'Brand 2'],
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const coffees = await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.query(
      'SELECT * FROM coffees',
    );
    debug('coffees', coffees);
  });
});
