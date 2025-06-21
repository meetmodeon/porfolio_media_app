import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _newUserCount=new BehaviorSubject<number>(0);
  private _showContactDialog=signal(false);
  private _showUserProfileDialog=signal(false);
  private _setId=signal<any>(0);
  private _showComponent=signal<boolean>(
    typeof window !== 'undefined' && typeof window.sessionStorage !=='undefined'?
    JSON.parse(sessionStorage.getItem('showComponent')??'false'):false
  );
  newUserCount=this._newUserCount.asObservable();
  showComponent=this._showComponent.asReadonly();
  showContactDialog=this._showContactDialog.asReadonly();
  showUserProfileDialog=this._showUserProfileDialog.asReadonly();
  getUserId=this._setId.asReadonly();

  
  constructor() {
    
   }

  increaseNewUserCount(){
    this._newUserCount.next(this._newUserCount.getValue()+1);
  }
  setShowComponent(value:boolean|any){
    if(typeof window!== 'undefined' && typeof window.sessionStorage !== 'undefined'){
      this._showComponent.set(value);
    sessionStorage.setItem('showComponent',JSON.stringify(value));
    }
  }
  

 
  triggerContactDialog(){
    this._showContactDialog.set(true)
  }
  closeContactDialog(){
    this._showContactDialog.set(false);
  }
  triggerProfileDialog(){
    this._showUserProfileDialog.set(true);
  }
  closeProfileDialog(){
    this._showUserProfileDialog.set(false);
  }
  setIdValue(userId:any){
    this._setId.set(userId);
  }

}
