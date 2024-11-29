import { Module } from '@nestjs/common';
import { TypeormController } from './typeorm.controller';
import { TypeormService } from './services/typeorm/typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeEntity } from './entities/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoffeeEntity])],
  controllers: [TypeormController],
  providers: [TypeormService],
})
export class TypeormModule {}
