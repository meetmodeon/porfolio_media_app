import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectsServiceService } from '../../service/project/projects-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolverService implements Resolve<any>{

  constructor(
    private projectService:ProjectsServiceService
  ) { }
  resolve():Observable<any> {
    return this.projectService.getAllProjects(0);
  }
}
