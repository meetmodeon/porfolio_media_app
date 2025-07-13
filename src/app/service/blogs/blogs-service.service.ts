import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BlogsRequest } from '../../modules/blogsRequest';
import { Observable } from 'rxjs';
import { BlogsResponse } from '../../modules/blogs-response';

@Injectable({
  providedIn: 'root'
})
export class BlogsServiceService {
  apiUrl=environment.apiUrl;
  // portfolio";

  constructor(private http:HttpClient) { }

  addBlogs(blogsData:BlogsRequest):Observable<any>{
    return this.http.post(`${this.apiUrl}/blogs/addBlogs`,blogsData);
  }

  updatesBlogs(blogsId:number,blogsData:BlogsRequest):Observable<any>{
    return this.http.put(`${this.apiUrl}/blogs/updateBlogs/${blogsId}`,blogsData);
  }
  getBlogById(blogsId:any):Observable<any>{
    return this.http.get(`${this.apiUrl}/blogs/getBlogsWithId/${blogsId}`);
  }
  getBlogs(page:number=0,size:number=10):Observable<any>{
    const params=new HttpParams()
    .set('page',page)
    .set('size',size);
    return this.http.get(`${this.apiUrl}/blogs/getBlogs`,{params})
  }
  getAllBlogsByAdmin(page:number=0,size:number=10):Observable<any>{
    const params= new HttpParams()
    .set('pageIndex',page)
    .set('pageSize',size);
    return this.http.get(`${this.apiUrl}/blogs/getAllBlogsByAdmin`,{params:params});
  }
  updateBlogsShowStatus(blogId:number|string,formData:any):Observable<any>{

    return this.http.put(`${this.apiUrl}/blogs/updateBlogShowStatus/${blogId}`,formData);
  }
  getBlogsByUserId(userId:any,pageIndex:number=0,pageSize:number=20):Observable<any>{
    const params=new HttpParams()
    .set("pageIndex",pageIndex)
    .set("pageSize",pageSize);
    return this.http.get(`${this.apiUrl}/blogs/getAllBlogsByUserId/${userId}`,{params:params})
  }
  deleteBlogs(blogsId:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/blogs/deleteBlogs/${blogsId}`);
  }

}
