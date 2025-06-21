import { CanActivateChildFn } from '@angular/router';

export const authGuardChildGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
