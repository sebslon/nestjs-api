import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { OptimizeController } from './optimize.controller';
import { ImageProcessor } from './optimize.processor';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
      // Running jobs in separate processes
      processors: [
        {
          name: 'optimizeImage',
          path: join(__dirname, 'image.processor.js'),
        },
      ],
    }),
  ],
  providers: [ImageProcessor],
  exports: [],
  controllers: [OptimizeController],
})
export class OptimizeModule {}
