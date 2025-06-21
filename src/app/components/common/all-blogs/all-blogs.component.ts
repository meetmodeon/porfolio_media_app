import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProjectResponse } from '../../../modules/project-response';
import { BlogsResponse } from '../../../modules/blogs-response';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { StateService } from '../state/state.service';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddBlogsComponent } from "../../admin/add-blogs/add-blogs.component";
import { ToastModule } from 'primeng/toast';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-blogs',
  imports: [
    CommonModule,
    AddBlogsComponent,
    ToastModule,
    ConfirmPopupModule,
    ConfirmDialog,
    ToggleSwitchModule,
    FormsModule,

],
providers:[ConfirmationService,MessageService],
  templateUrl: './all-blogs.component.html',
  styleUrl: './all-blogs.component.scss'
})
export class AllBlogsComponent implements OnInit{
   myBlogsList:BlogsResponse[]=[];
   page:number=0;
   lastPage!:boolean;
   firstPage!:boolean;
   userId!:any;
   showAddBtn!:boolean;
   isShow=signal<boolean>(false);
   isShowBlogForms=signal<boolean>(false);
   constructor(private blogsService:BlogsServiceService,
    private stateService:StateService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService
   ){}

  ngOnInit()  {
    this.showAddBtn=UserStorageService.isAuthenticate();
    this.userId=this.stateService.getUserId();
 
    UserStorageService.isAuthenticate()?this.getBlogs(UserStorageService.getUserId(),this.page):this.getBlogs(this.userId,this.page);
     
  }
 onBlogsAdded(){
  const userId=UserStorageService.isAuthenticate()
  ?UserStorageService.getUserId():
  this.userId;
  this.getBlogs(userId,this.page);
 }
   getBlogs(userId:any,pageIndex:number){
    console.log("This is UserId:: ",userId)
    this.stateService.setIdValue(userId);
    this.blogsService.getBlogsByUserId(userId,pageIndex).subscribe({
      next:(data:any)=>{
        this.myBlogsList=data.content;
        this.lastPage=data.last;
        this.firstPage=data.first;
        this.myBlogsList.forEach(blogs=>
          {
           blogs.title=blogs.title.trim()
           blogs.title=blogs.title.charAt(0).toUpperCase()+blogs.title.slice(1).toLowerCase();
            blogs.createdAt=timeAgo(blogs.createdAt);
          }
          )
        console.log(this.myBlogsList);
       },
       error:(error:any)=>{
        console.log("This blogs error is:: ",error);
       }
   })
  }
  seeMore(){
    this.page=this.page+1;
   UserStorageService.isAuthenticate()?this.getBlogs(UserStorageService.getUserId(),this.page):this.getBlogs(this.userId,this.page);
  }
  previous(){
    this.page=this.page-1;
     UserStorageService.isAuthenticate()?this.getBlogs(UserStorageService.getUserId(),this.page):this.getBlogs(this.userId,this.page);
  }

  isNew(date:string|number|Date):boolean{
    if(date.toString().toLowerCase().includes('minut')|| date.toString().toLowerCase().includes('hour')|| date.toString().toLowerCase().match('1 day ago') || date.toString().toLowerCase().match('2 days ago') || date.toString().toLowerCase().match('3 days ago'))
      {
        return true;
      }else{
        return false;
      }

  }
  changeStatus(event:boolean){
    this.isShowBlogForms.set(event);
  }
  addNewBlog(){
    this.isShowBlogForms.set(true);
  }
   deleteBlog(event:any,blogId:any){
    console.log("This is delete blogs event::");
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
              this.blogsService.deleteBlogs(blogId).subscribe({
                next:(value:any)=>{
                  this.messageService.add({severity:'success',summary:'Deleted',detail:"Blogs is deleted successfully"});
                   UserStorageService.isAuthenticate()?this.getBlogs(UserStorageService.getUserId(),this.page):this.getBlogs(this.userId,this.page);
                },
                error:(error:any)=>{
                  this.messageService.add({severity:'error',summary:'Error',detail:"Something went wrong in deleting project with id:: "+blogId+error.error});
                }
              })
            },
        });
  }
  toggleVisibility(blogId:number|string,isVisible:boolean|any){
    const formData=new FormData();
    formData.append('show',isVisible);
    this.blogsService.updateBlogsShowStatus(blogId,formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:"Updated",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Failed",detail:error.message,life:3000});
      }
    })
  }

}
export function timeAgo(date:string|number|Date):string{
  
  return formatDistanceToNow(new Date(date),{addSuffix:true})
}

