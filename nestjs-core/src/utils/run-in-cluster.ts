// JavaScript is single-threaded in nature.
// Aside from the fact that it runs input and output operations in separate threads, Node.js allows us to create multiple processes.

// To prevent heavy traffic from putting a strain on our API, we can also launch a cluster of Node.js processes.
// Such child processes share server ports and work under the same address. With that, the cluster works as a load balancer.
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as cluster from 'cluster';
import * as os from 'os';

export function runInCluster(bootstrap: () => Promise<void>) {
  const numberOfCores = os.cpus().length;

  if (cluster.isPrimary) {
    for (let i = 0; i < numberOfCores; ++i) {
      cluster.fork(); // create a child process for each core in CPU
    }
  } else {
    bootstrap();
  }
}

// By default, Node.js uses the round-robin approach in which the master process listens on the port we’ve opened.
// It accepts incoming connections and distributes them across all of the processes in our cluster.
