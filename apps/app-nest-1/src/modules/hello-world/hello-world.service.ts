import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  getGreeting(): string {
    return 'Hello World!';
  }
}
