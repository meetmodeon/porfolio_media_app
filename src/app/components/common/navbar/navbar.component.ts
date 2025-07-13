import { Component, computed, effect, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StateService } from '../state/state.service';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    SplitButtonModule,
    CommonModule,
    InputIconModule,
    ButtonModule,
    IconFieldModule,
    ConfirmPopup,
    Toast,
    TooltipModule,
   


  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showComponent:any;
   items: MenuItem[''] | undefined;
   setlabel=signal<string>('');
   userId:number|any;
   

  constructor(private stateService:StateService,
    private messageService:MessageService,
    private router:Router,
    private activeRouter:ActivatedRoute,
    private confirmService:ConfirmationService
  ){
    effect(()=>{
      this.showComponent=computed(()=>this.stateService.showComponent());
      console.log(this.stateService.showComponent());
    })
     this.onEnter();
  }
  
  
  getUserId():string|number|null{
    if(UserStorageService.isAuthenticate()){
      return UserStorageService.getUserId();
    }
    return null;
  }
  submit(){
    if(this.getUserId===null){
      this.messageService.add({severity:'error',summary:"Login",detail:"Please login",life:3000})
      this.router.navigateByUrl("/login");
    }else{
      this.router.navigate(['/common/dashboard',UserStorageService.getUserId()])
    }
    
  }
  
  onEnter() {
    if(UserStorageService.isAuthenticate()){
      this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => {
         this.router.navigate(['/common/dashboard',UserStorageService.getUserId()])
        },
      },
      {
        label: 'View Profile',
        icon: 'pi pi-eye',
        command: () => {
         this.router.navigateByUrl('/viewMyProfile');
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
         UserStorageService.logout();
         this.stateService.setShowComponent(false);
         this.router.navigateByUrl('');
        },
      },
    ];
    }else{
      this.items = [
        {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
         this.router.navigateByUrl('');
        },
      },
      {
        label: 'Login',
        icon: 'pi pi-user',
        command: () => {
           console.log("Trying to vibrate...");
          navigator.vibrate?.(50);
         this.router.navigateByUrl("/login");
        },
      },
      {
        label: 'Signin',
        icon: 'pi pi-sign-in',
        command: () => {
         this.router.navigateByUrl('/signin');
        },
      },
     
    ];
    }
    
  }

  logout(event:any){
   this.confirmService.confirm({
      target: event.target as EventTarget,
      message: 'Logout',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Logout',
        severity: 'danger',
      },

      accept: () => {
        if(UserStorageService.isAuthenticate()){
          UserStorageService.logout();
          this.stateService.setShowComponent(false);
          this.router.navigateByUrl("/");
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
  

}
