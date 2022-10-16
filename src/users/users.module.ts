import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './user.entity';

@Module({
  // module can also import other modules.
  imports: [TypeOrmModule.forFeature([User])],
  //A provider is something that can inject dependencies. An example of such is a service.
  // We put the  UsersService into the  providers array of the  UsersModule to state that it belongs to that module.
  providers: [UsersService],
  // By putting the  UsersService into the  exports array, we indicate that the module exposes it. We can think of it as a public interface of a module.
  exports: [UsersService],
})
export class UsersModule {}

// When we import the  UsersModule, we have access to all of the exported providers.
