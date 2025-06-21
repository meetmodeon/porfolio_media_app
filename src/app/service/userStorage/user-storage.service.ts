import { Injectable } from '@angular/core';
import { MyDetailsResponse } from '../../modules/my-details-response';
const TOKEN='token';
const USER='myData';
@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
 
  constructor() { }

  private isBrowser():boolean{
    return typeof window !== 'undefined' && typeof window.localStorage !=='undefined' ; 
  }
  public saveToken(token:string):void{
    if(this.isBrowser()){
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN,token);
    }
  }
  static getToken():string|null{
    if(typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' ){
      return localStorage.getItem('token');
    }
    return null;
  }

  public saveMyData(myData:MyDetailsResponse):void{
    if(this.isBrowser()){
      window.localStorage.removeItem(USER);
      window.localStorage.setItem(USER,JSON.stringify(myData));
    }
  }

  public static getMyData():MyDetailsResponse|null{
    if(typeof window !== 'undefined' && window.localStorage ){
      const myData=window.localStorage.getItem(USER);
      return myData?JSON.parse(myData):null;
    }
    return null;
  }

  static getUserId():string|any{
    const user=this.getMyData();
    if(user === null){
      return '';
    }
    return user.id;
  }

  static getUserRole():string{
    const user = this.getMyData();
    if(user === null){
      return '';
    }
    return user.role;
  }
  static isAuthenticate():boolean{
    const token = this.getToken();
    return !!token;
  }

  static isAdminLoggedIn():boolean{
    if(this.getToken()=== null){
      return false;
    }
    const role:string = this.getUserRole();
    return role ==='ADMIN';
  }

  static isUserLoggedIn():boolean{
    if(this.getToken() === null){
      return false;
    }
    const role:string=this.getUserRole();
    return role ==='USER';
  }
  public static logout():void{
    if(this.getMyData()!== null && this.getToken() !==null){
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('myData');
      sessionStorage.removeItem('showComponent');
      sessionStorage.clear();
    }
  }
}
