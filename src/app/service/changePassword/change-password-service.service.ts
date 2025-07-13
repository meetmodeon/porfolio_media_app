import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordServiceService {

  constructor(private http:HttpClient) { }
  private apiUrl=environment.apiUrl;
  // "/portfolio";

  generateOpt(email:string):Observable<any>{
   const formData=new FormData();
   formData.append("email",email);
    return this.http.post(`${this.apiUrl}/otp/send-otp`,formData);
  }
  changePassword(changePasswordData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/otp/verify-otp-and-change-password`,changePasswordData);
  }
}
