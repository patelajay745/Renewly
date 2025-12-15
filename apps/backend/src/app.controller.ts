import { Controller, Get } from '@nestjs/common';
import { Protected } from './decorators/protected.decorator';

@Controller("/")
export class AppController {
  constructor() { }

  @Get("/")
  getHello(): string {
    return "Up and Running";
  }

}
