import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogsServiceService } from '../../service/blogs/blogs-service.service';

@Injectable({
  providedIn: 'root'
})
export class BlogResolverService implements Resolve<any>{

  constructor(
    private blogService:BlogsServiceService
  ) { }
  resolve():Observable<any> {
    return this.blogService.getBlogs(0);
  }
}
