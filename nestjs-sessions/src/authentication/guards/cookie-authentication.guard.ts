import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class CookieAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // The isAuthenticated function is attached to request object by Passport. Therefore, we don’t need to implement it ourselves.
    // The isAuthenticated returns true only if the user is successfully authenticated.
    return request.isAuthenticated();
  }
}
