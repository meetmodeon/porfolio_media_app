import { Component } from '@angular/core';
import { MyDetailsResponse } from '../../../modules/my-details-response';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { BlogsResponse } from '../../../modules/blogs-response';
import { ProjectResponse } from '../../../modules/project-response';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { StateService } from '../state/state.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    AnimateOnScrollModule,
    CommonModule,
    ConfirmDialog,
    Dialog,
    ToastModule,
    TooltipModule,
    
  ],
  providers:[ConfirmationService,MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  myData:MyDetailsResponse={
    email:'',
    name:'',
    role:'',
    specialized:'',
    returnImg:'',
    description:'',
    cvFileName:'',
    cvFile:''
  };
  myBlogsList!:BlogsResponse[];
  myProjectsList!:ProjectResponse[];
  userId!:number|null|any;
  profileImg!:File|String|undefined|any;
  profileImgURl!:string;
  visible:boolean=false;
  imgMsg:string='';
  allowedType=['image/jpeg','image/png','image/jpg'];
  isAuth=false;
  isShowView=false;
  isShowBoth=false;
  isShowUpload=false;
  pageIndex=0;
  cvPdfFile:File|string|any;
  constructor(
    private myDetailsService:MyDetailsServiceService,
    private blogsService:BlogsServiceService,
    private projectsService:ProjectsServiceService,
    private route:ActivatedRoute,
    private stateService:StateService,
    private messageService:MessageService
  ){}

  ngOnInit(){
   this.route.params.subscribe((params:Params)=>{
    this.userId=params['id'];
    this.stateService.setIdValue(this.userId);
   })
    this.getMyDetials(this.userId);
    this.getBlogs(this.userId,this.pageIndex);
    this.getAllProjects(this.userId,this.pageIndex);
    this.isAuth=UserStorageService.isAuthenticate();
    this.viewResumeBtn();
  }
  viewResumeBtn(){
    if(UserStorageService.isAuthenticate() && this.myData.cvFileName !== ''){
      console.log(this.myData.cvFileName);
      this.isShowBoth=true;
    }else if(!UserStorageService.isAuthenticate() && this.myData.cvFileName!==''){
      console.log(this.myData.cvFileName);
      this.isShowBoth=false;
      this.isShowUpload=false;
      this.isShowView=true;
    }else if(UserStorageService.isAuthenticate() && this.myData.cvFileName===''){
      this.isShowUpload=true;
      this.isShowBoth=false;
      this.isShowView=false;
    }else{
      this.isShowBoth=false;
      this.isShowView=false;
      this.isShowUpload=false;
    }
  }
  getMyDetials(userId:any){
    this.myDetailsService.getMyDetails(userId).subscribe({
      next:(data:any)=>{
        this.myData=data;
        console.log(this.myData)
      }
    })
  }
  getBlogs(userId:any,pageIndex:any){
    this.blogsService.getBlogsByUserId(userId,pageIndex).subscribe({
      next:(data:any)=>{
        this.myBlogsList=data.content;
        this.myBlogsList.forEach(blogs=>
          {
            blogs.createdAt=blogs.createdAt.toString().slice(0,9)
          }
          )
       
      }
    })
  }
  getAllProjects(userId:any,pageIndex:any){
   
    this.projectsService.getProjectsByUserId(userId,pageIndex).subscribe({
      next:(value:any)=>{
        this.myProjectsList=value.content;
        console.log(this.myProjectsList);
      }
    })
  }
  onFileUpload(fileInput:HTMLInputElement){
    fileInput.click();
  }
  uploadFile(event:any){
   if(UserStorageService.isAuthenticate()){
     const input= event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      const file= input.files[0];
      const fileType=file.type;
      if(this.allowedType.includes(fileType) && file.size<2*1024*1024){
        this.profileImg=file;
        const reader=new FileReader();
        reader.onload=()=>{
          this.profileImgURl=reader.result as string;
        };
        reader.readAsDataURL(this.profileImg);
        this.uploadProfileImage(UserStorageService.getUserId(),this.profileImg);
      }else{
        this.profileImg=null;
        this.visible=true;
        this.imgMsg="Please upload image size more than 2MB or .jpg,.png,.jpeg format file";
     }
   }
   }
  }

  uploadProfileImage(userId:any,profileImage:any){
    const formData=new FormData();
    if(profileImage){
      formData.append('file',profileImage)
    }
    this.myDetailsService.uploadProfileImg(userId,formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:"Updated",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:"error",summary:"Failed to upload",detail:error.error,life:3000});
      }
    })
  }
  triggerFile(fileInput:HTMLInputElement){
    fileInput.click();
  }
  onCvFileSelected(event:any){
    const Input=event.target as HTMLInputElement;
    if(Input.files && Input.files.length>0){
      const file=Input.files[0];
      const fileType=file.type;

      if(fileType ==='application/pdf' && file.size<5*1024*1024){
        this.cvPdfFile=file;
        const reader= new FileReader();
        reader.readAsDataURL(this.cvPdfFile);
      }else{
        this.cvPdfFile=null;
        this.messageService.add({severity:'danger',summary:'Error',detail:"File must be pdf formate and size is less the 5 MB",life:3000})
      }
      this.uploadCvPdf();
    }
    
  }

  uploadCvPdf(){
   if(UserStorageService.isAuthenticate()){
     const formData=new FormData();
     formData.append('file',this.cvPdfFile);
     this.myDetailsService.uploadCv(formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:"success",summary:"Cv Uploaded",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Error cv",detail:error.message,life:3000});
      }
     })
   }
  }
  downloadResume(){
    this.myDetailsService.downloadCv(this.userId).subscribe({
      next:(value:Blob)=>{
        console.log("this is blob data from resume download: ",value);
        // const link = document.createElement('a');
        // link.href=window.URL.createObjectURL(value);
        // link.download=`user_${this.myData.name}_resume.pdf`;
        // link.click();
       if (value.type !== 'application/pdf') {
        console.error("Invalid PDF file");
        return;
       }

      const blobUrl = URL.createObjectURL(value);
      window.open(blobUrl, '_blank');
     },
    error: (err) => {
      console.error("Error while viewing resume", err);
    }
    });
  }

}
