import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import Permission from './permission.type';

import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/types/request-with-user';

const PermissionGuard = (permission: Permission): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.permissions.includes(permission);
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
