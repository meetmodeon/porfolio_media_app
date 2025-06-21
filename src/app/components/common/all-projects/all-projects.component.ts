import { Component, model, signal } from '@angular/core';
import { ProjectResponse } from '../../../modules/project-response';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { formatDistanceToNow } from 'date-fns';
import { StateService } from '../state/state.service';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { AddProjectsComponent } from "../../admin/add-projects/add-projects.component";
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import e from 'express';

@Component({
  selector: 'app-all-projects',
  imports: [
    CommonModule,
    GalleriaModule,
    AddProjectsComponent,
    TooltipModule,
    ConfirmDialog, ToastModule, ButtonModule,
    ProgressSpinnerModule,
    ToggleSwitchModule,
    FormsModule,
],
  providers:[MessageService,
    ConfirmationService,

  ],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss'
})
export class AllProjectsComponent {

  projectDataList:ProjectResponse[]=[];
   page:number=0;
   lastPage!:boolean; 
   firstPage!:boolean;
   userId!:any;
   isLoading=false;
   showAddBtn!:boolean;
   isShow=signal<boolean>(false);
   authenticated!:boolean;

   constructor(private projectService:ProjectsServiceService,
    private messageService:MessageService,
    private stateService:StateService,
    private confirmationService:ConfirmationService
   ){}
   ngOnInit(){
    this.authenticated = UserStorageService.isAuthenticate();
   }


   ngAfterViewInit(){
   const uid = this.authenticated ? UserStorageService.getUserId() : this.stateService.getUserId();

  if (uid !== null && uid !== undefined) {
    this.userId = uid;
    this.getAllProject(uid, this.page);
    this.showAddBtn = this.authenticated;
  } else {
    console.warn('User ID not available at the moment, retrying in 100ms...');
  }
   }
   onAddProject(){
    UserStorageService.isAuthenticate()?this.getAllProject(UserStorageService.getUserId(),this.page):this.getAllProject(this.stateService.getUserId(),this.page);
   }

    changeIsShow(event:boolean){
    this.isShow.set(event);
  }
  addNewProject(){
    this.isShow.set(true);
  }

   getAllProject(userId:any,page:number){
    this.isLoading=true;
    if (!userId) {
    console.error('Cannot fetch projects: userId is invalid.');
    return;
  }
    this.stateService.setIdValue(userId);
    this.projectService.getProjectsByUserId(userId,page).subscribe({
      next:(data:any)=>{
        this.lastPage=data.last;
        this.firstPage=data.first;
        this.isLoading=false
        
        console.log("project data:",data)
        this.projectDataList=data.content;
        console.log(this.projectDataList);
        
        
      },
      error:(error:any)=>{
        this.messageService.add({
          severity:'error',
          summary:"Error",
          sticky:true,
          detail:"Something went wrong in fetching project list data"+error.message,
          life:100000
        })
        console.log("The project data error:: "+error);
      }
    })
   }
   seeMore(){
    this.page=this.page+1;
    UserStorageService.isAuthenticate()?this.getAllProject(UserStorageService.getUserId(),2):this.getAllProject(this.stateService.getUserId(),2);
   }
   previous(){
    this.page=this.page-1;
    UserStorageService.isAuthenticate()?this.getAllProject(UserStorageService.getUserId(),this.page):this.getAllProject(this.stateService.getUserId(),this.page);
   }

    isNew(date:string|number|Date):boolean{
      const myDate=timeAgo(date);
    if(myDate.toString().toLowerCase().includes('minut')|| myDate.toString().toLowerCase().includes('hour')|| myDate.toString().toLowerCase().match('1 day ago') || myDate.toString().toLowerCase().match('2 days ago') || myDate.toString().toLowerCase().match('3 days ago'))
      {
        return true;
      }else{
        return false;
      }

  }
  deleteProject(event:any,projectId:any){
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
              this.projectService.deleteProject(projectId).subscribe({
                next:(value:any)=>{
                  this.messageService.add({severity:'success',summary:'Deleted',detail:"project is deleted successfully"});
                   UserStorageService.isAuthenticate()?this.getAllProject(UserStorageService.getUserId(),this.page):this.getAllProject(this.userId,this.page);
                },
                error:(error:any)=>{
                  this.messageService.add({severity:'error',summary:'Error',detail:"Something went wrong in deleting project with id:: "+projectId+error.error});
                }
              })
            },
        });
  }

  toggleVisibility(projectId:any,isVisible:any){
    const formData=new FormData();
    formData.append('show',isVisible);
    this.projectService.updateProjectShowStatus(projectId,formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:"Updated",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Error",detail:error.message,life:3000});
      }
    })
  }
}
export function timeAgo(date:string|number|Date):string{
  return formatDistanceToNow(new Date(date),{addSuffix:true});
}
