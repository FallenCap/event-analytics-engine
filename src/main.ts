import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { ClusterService } from './cluster.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Worker ${process.pid} running on port ${port}`);
}

ClusterService.clusterize(bootstrap);
