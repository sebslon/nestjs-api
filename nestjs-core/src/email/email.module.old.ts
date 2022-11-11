// import {
//   ConfigurableModuleAsyncOptions,
//   DynamicModule,
//   Module,
// } from '@nestjs/common';

// import { EmailOptions } from './types/email-options.interface';
// import { ConfigurableEmailModule } from './types/email.module-definition';

// // Dynamic Module
// @Module({})
// export class EmailModule extends ConfigurableEmailModule {
//   static register(options: EmailOptions): DynamicModule {
//     return {
//       // MANUAL IMPL.
//       //   module: EmailModule,
//       //   providers: [
//       //     {
//       //       provide: EMAIL_CONFIG_OPTIONS,
//       //       useValue: options,
//       //     },
//       //     EmailService,
//       //   ],
//       //   exports: [EmailService],
//       // };
//       // IMPL EXTENDING INTERFACE
//       /*
//         Additional logic here
//       */
//       ...super.register(options),
//     };
//   }

//   static registerAsync(
//     options: ConfigurableModuleAsyncOptions<EmailOptions>,
//   ): DynamicModule {
//     return {
//       // MANUAL IMPL.
//       //   module: EmailModule,
//       //   imports: options.imports,
//       //   providers: [
//       //     {
//       //       provide: EMAIL_CONFIG_OPTIONS,
//       //       useFactory: options.useFactory,
//       //       inject: options.inject,
//       //     },
//       //     EmailService,
//       //   ],
//       //   exports: [EmailService],
//       // };
//       // IMPL EXTENDING INTERFACE
//       /*
//           Additional logic here
//       */
//       ...super.registerAsync(options),
//     };
//   }
//   // Under the hood, our registerAsync method is very similar to register.
//   // The difference is that it uses useFactory and inject instead of useValue. It also accepts an array of additional modules to import through options.imports.
// }
