import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';

// FIX for GraphQL Subscriptions
@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const op = context.getArgByIndex(3).operation.operation;

      if (op === 'subscription') {
        return next.handle();
      }
    }

    return super.intercept(context, next);
  }
}
