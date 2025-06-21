import { HttpInterceptorFn } from '@angular/common/http';
import { UserStorageService } from '../service/userStorage/user-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq=req;
  const url=req.url;
  if(url.startsWith("/public/dashboard")
     || url.startsWith('/login') || url.startsWith('/signin')){
    return next(authReq);
  }
  
  const token=UserStorageService.getToken();
  if(token !== null){
    authReq=authReq.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    })
    return next(authReq);
  }
  return next(req);
};
