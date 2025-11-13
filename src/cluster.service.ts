import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { Injectable, Logger } from '@nestjs/common';

const numCPUs = availableParallelism();

@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    const logger = new Logger('Bootstrap');
    if (cluster.isPrimary) {
      logger.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        logger.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      logger.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
