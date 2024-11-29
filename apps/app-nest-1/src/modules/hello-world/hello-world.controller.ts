import { Controller, Get } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';

@Controller({
  path: 'hello-world',
})
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Get()
  greet(): string {
    return this.helloWorldService.getGreeting();
  }
}
