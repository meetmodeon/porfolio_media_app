import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsServiceService {
  private apiUrl= environment.apiUrl;
  // +"/portfolio";
  constructor(private http:HttpClient) { }

  addProjects(projectData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/projects/addProjects`,projectData);
  }

  updateProjects(projectId:any,projectData:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/projects/updateProjects/${projectId}`,projectData);
  }

  getAllProjects(page:number=0,size:number=20):Observable<any>{
    const params=new HttpParams()
    .set('page',page)
    .set('size',size);
    return this.http.get(`${this.apiUrl}/projects/getAllProjects`,{params:params});
  }
  getAllProjectsByAdmin(page:number=0,size:number=10):Observable<any>{
    const params= new HttpParams()
    .set('pageIndex',page)
    .set('pageSize',size);
    return this.http.get(`${this.apiUrl}/projects/getAllProjectsByAdmin`,{params:params})
  }
   getProjectsByUserId(userId:any,pageIndex:number=0,pageSize:number=20):Observable<any>{
    const params=new HttpParams()
    .set("pageIndex",pageIndex)
    .set("pageSize",pageSize);

    return this.http.get(`${this.apiUrl}/projects/getAllProjectsByUserId/${userId}`,{params})
  }
  getProjectById(projectId:any):Observable<any>{
    return this.http.get(`${this.apiUrl}/projects/getProjectById/${projectId}`);
  }
  updateProjectShowStatus(projectId:number|string,formData:any):Observable<any>{
   
    return this.http.put(`${this.apiUrl}/projects/updateProjectShowStatus/${projectId}`,formData);
  }

  deleteProject(projectId:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/projects/deleteProjects/${projectId}`);
  }
}
