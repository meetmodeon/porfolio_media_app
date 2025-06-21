import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../modules/login-request';
import { Observable } from 'rxjs';
import { MyDetailsResponse } from '../../modules/my-details-response';
import { MyDetailsRequest } from '../../modules/my-detailsRequest';

@Injectable({
  providedIn: 'root'
})
export class MyDetailsServiceService {

  constructor(private http:HttpClient) { }
  private apiUrl=environment.apiUrl;

  login(loginRequest:LoginRequest):Observable<any>{
    return this.http.post(`${this.apiUrl}/myDetails/login`,loginRequest);
  }

  updateProfile(myDetailsId:any,myDetails:MyDetailsRequest):Observable<any>{
    return this.http.put(`${this.apiUrl}/myDetails/update/profile/${myDetailsId}`,myDetails);
  }

  uploadProfileImg(myDetailsId:any,imageData:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/myDetails/update/profileImg/${myDetailsId}`,imageData);
  }

  getMyDetails(userId:any):Observable<any>{
    return this.http.get(`${this.apiUrl}/myDetails/getMyDetails/${userId}`)
  }
  saveUserInfo(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/myDetails/saveUserInfo`,userData);
  }
  searching(keyword:any):Observable<any>{
    const params=new HttpParams()
    .set('words',keyword);
    return this.http.get(`${this.apiUrl}/myDetails/searching`,{params})
  }
  uploadCv(formData:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/myDetails/upload/cv`,formData);
  }
  downloadCv(userId:any):Observable<Blob>{
    return this.http.get(`${this.apiUrl}/myDetails/cv/download/${userId}`,{responseType: 'blob'});
  }
  deleteUserById(userId:any):Observable<any>{
    return this.http.delete(`${this.apiUrl}/myDetails/deleteUserById/${userId}`);
  }

  getNoOfNewUser():Observable<any>{
    return this.http.get<{ TotalUser: number }>(`${this.apiUrl}/myDetails/getTotalNewUser`);
  }

  getAllUser(pageIndex:number=0,pageSize:number=10):Observable<any>{
    const params=new HttpParams()
    .set('pageSize',pageSize)
    .set('pageIndex',pageIndex);
    return this.http.get(`${this.apiUrl}/myDetails/getAllUser`,{params})

  }
  createNewAccount(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/myDetails/createNewAccount`,userData);
  }
  updateNewUserStatus(userId:number,isNew:boolean):Observable<any>{
    return this.http.put(`${this.apiUrl}/myDetails/updatedNewUserStatus/${userId}`,isNew)
  }
  getUserIdAndName():Observable<any>{
    return this.http.get(`${this.apiUrl}/myDetails/getUserIdAndName`);
  }
  getDashboardStat():Observable<any>{
    return this.http.get(`${this.apiUrl}/myDetails/getDashboardStat`);
  }

  getCountOfPost():Observable<any>{
    return this.http.get(`${this.apiUrl}/actuator/metrics/http.server.requests?tag=method:POST`)
  }
  getCountOfGet():Observable<any>{
    return this.http.get(`${this.apiUrl}/actuator/metrics/http.server.requests?tag=method:GET`)
  }
  getCountOfDelete():Observable<any>{
    return this.http.get(`${this.apiUrl}/actuator/metrics/http.server.requests?tag=method:DELETE`)
  }
  getCountOfPut():Observable<any>{
    return this.http.get(`${this.apiUrl}/actuator/metrics/http.server.requests?tag=method:PUT`)
  }
}
