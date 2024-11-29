import { Controller, Get, Post } from '@nestjs/common';
import { TypeormService } from './services/typeorm/typeorm.service';

@Controller('typeorm')
export class TypeormController {
  constructor(private readonly typeormService: TypeormService) {}

  @Get('raw-query')
  executeRawQuery() {
    return this.typeormService.executeRawQuery();
  }

  @Get('coffee/transform')
  transform() {
    return this.typeormService.transform();
  }

  @Get('coffee')
  findAll() {
    return this.typeormService.findAll();
  }

  @Post('coffee')
  create() {
    return this.typeormService.create();
  }
}
