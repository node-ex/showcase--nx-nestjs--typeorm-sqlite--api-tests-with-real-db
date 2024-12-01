import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeormModule } from './typeorm.module';
import { configModuleImports } from '../../shared/imports/config-module.imports';
import { typeOrmModuleImports } from '../../shared/imports/typeorm-module.imports';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CoffeeEntity } from './entities/coffee.entity';

describe('TypeormController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let coffeeRepository: Repository<CoffeeEntity>;

  beforeEach(async () => {
    /**
     * https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
     */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...configModuleImports, ...typeOrmModuleImports, TypeormModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    coffeeRepository = moduleFixture.get(getRepositoryToken(CoffeeEntity));
  });

  afterEach(async () => {
    /**
     * Don't forget to close the app after the tests, otherwise Jest will hang,
     * because of an open connection from the MongooseModule.
     */
    await app.close();
    jest.restoreAllMocks();
  });

  it('GET /typeorm/coffee', async () => {
    await coffeeRepository.insert({
      name: 'some-coffee',
      brand: 'some-brand',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await request(app.getHttpServer())
      .get('/typeorm/coffee')
      .expect(200);

    expect(result.body).toEqual([
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(Number),
        name: 'some-coffee',
        brand: 'some-brand',
        flavors: null,
      },
    ]);
  });
});
