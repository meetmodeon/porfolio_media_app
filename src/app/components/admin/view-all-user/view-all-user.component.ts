import { ChangeDetectorRef, Component, Signal, signal } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { MyDetailsResponse } from '../../../modules/my-details-response';
import { AvatarGroup } from 'primeng/avatargroup';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StateService } from '../../common/state/state.service';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-view-all-user',
  imports: [
    TableModule,
    Avatar,
    AvatarGroup,
    CommonModule,
    ButtonModule,
    Dialog,
    ToastModule,
    ConfirmPopupModule

],
  providers:[MessageService,ConfirmationService],
  templateUrl: './view-all-user.component.html',
  styleUrl: './view-all-user.component.scss'
})
export class ViewAllUserComponent{
  userListData:MyDetailsResponse[]=[];
  pageIndex=0;
  isShowProfile = signal<boolean>(false);
  visible!: Signal<boolean>;
  ishide:boolean=true;
  userData:MyDetailsResponse={
    id:'',
    name:'',
    email:'',
    role:'',
    specialized:'',
    returnImg:'',
    description:''
  };
  loading=false;

  constructor(private myDetailsService:MyDetailsServiceService,
    private messageSerivce:MessageService,
    private shared:StateService,
    private confirmationService:ConfirmationService,
    private cdRef:ChangeDetectorRef
  ){
    
  }
 

  ngOnInit(){
    this.visible=this.shared.showUserProfileDialog;
    //this.getAllUser(this.pageIndex);
  }
  ngAfterViewInit(){
    this.getAllUser();
  }

  
  get dialogVisible() {
    return this.visible();
  }

  set dialogVisible(value: boolean) {
    value ? this.shared.triggerProfileDialog() : this.shared.closeProfileDialog();
  }

  hideDialog() {
    this.shared.closeProfileDialog();
  }

   hidePage() {
    
    this.messageSerivce.add({
      severity: 'info',
      summary: 'Profile closed',
      detail: 'Closed Profile',
      life: 3000,
    });
  }

  getAllUser(){
    this.myDetailsService.getAllUser(this.pageIndex).subscribe({
      next:(value:any)=>{
        this.userListData=value.content; 
        this.userData.id='1';
        console.log("this is userlistdata, ",this.userListData);
        this.userListData.forEach(data=>{
          if(data.description.length>20){
            data.description=data.description.slice(0,20)+'...';
          }
        })
        this.cdRef.detectChanges();
      }
    })
  }
  deleteUserById(event:any,userId:number){
     this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.myDetailsService.deleteUserById(userId).subscribe({
          next: (data: any) => {
            this.messageSerivce.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: data.message,
            });
          },
          error: (error: any) => {
            this.messageSerivce.add({
              severity: 'error',
              summary: 'Error',
              detail: 'error.message',
            });
          },
        });
      },
      reject: () => {
        this.messageSerivce.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  showProfile(userId:any){
   console.log("The user id is:: ",userId)
   this.shared.triggerProfileDialog();
   this.getUserById(userId);
  }

  getUserById(userId:any){
    this.myDetailsService.getMyDetails(userId).subscribe({
      next:(value:MyDetailsResponse)=>{
        this.userData={
          id:value.id,
          email:value.email,
           name: value.name,
           role: value.role,
           specialized: value.specialized,
           returnImg: value.returnImg,
           description: value.description
        }
        
      }
    })
  }
}
