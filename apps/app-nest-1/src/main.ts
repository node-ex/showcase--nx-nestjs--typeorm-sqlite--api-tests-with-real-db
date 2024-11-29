/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ConfigModule,
  // ConfigService
} from '@nestjs/config';
import { CoreModule } from './modules/core/core.module';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  const app = await NestFactory.create(CoreModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // const config = app.get(ConfigService);
  // console.log(config.get('core.db.synchronize'));

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const port = Number(process.env['PORT']) || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port.toString()}/${globalPrefix}`,
  );
}

void bootstrap();
