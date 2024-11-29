import {
  // InjectDataSource,
  InjectRepository,
} from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { CoffeeEntity } from '../../entities/coffee.entity';
import { Coffee } from '../../types/coffee.interface';

@Injectable()
export class TypeormService {
  constructor(
    // @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(CoffeeEntity)
    private readonly coffeeRepository: Repository<CoffeeEntity>,
  ) {}

  async executeRawQuery() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: any[] = await this.dataSource.query('SELECT 1 as result');

    return result[0] as { result: number };
  }

  transform() {
    const coffee = this.coffeeRepository.create({
      id: 1,
      name: 'Coffee 1',
      brand: 'Brand 1',
      flavors: ['Flavor 1', 'Flavor 2'],
    });

    const plainCoffee = instanceToPlain(coffee) as Coffee;
    console.log('>>> coffee', coffee);
    console.log('>>> plainCoffee', plainCoffee);

    return plainCoffee;
  }

  findAll() {
    return this.coffeeRepository.find();
  }

  create() {
    return this.coffeeRepository.save({
      name: 'some-coffee',
      brand: 'some-brand',
      flavors: ['some-flavor-1', 'some-flavor-2'],
    });
  }
}
