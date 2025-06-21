import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../service/userStorage/user-storage.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const router=inject(Router);
 
  if(UserStorageService.isAuthenticate() && UserStorageService.isAdminLoggedIn()){
    return true;
  }else{
    router.navigateByUrl("/login");
    return false;
  }
};
