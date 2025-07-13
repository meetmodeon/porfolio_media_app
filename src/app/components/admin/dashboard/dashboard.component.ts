import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MyDetailsResponse } from '../../../modules/my-details-response';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { StateService } from '../../common/state/state.service';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ViewMyProfileComponent } from '../myProfileView/view-my-profile/view-my-profile.component';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { BlogsResponse } from '../../../modules/blogs-response';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { AddBlogsComponent } from '../add-blogs/add-blogs.component';
import { Router, RouterLink } from '@angular/router';
import { ProjectResponse } from '../../../modules/project-response';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { TooltipModule } from 'primeng/tooltip';
import { AddProjectsComponent } from '../add-projects/add-projects.component';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChartComponentComponent } from "../chart/chart-component/chart-component.component";
import { ViewAllUserComponent } from "../view-all-user/view-all-user.component";
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export interface newUserData {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    SplitButtonModule,
    ToastModule,
    ReactiveFormsModule,
    Dialog,
    AvatarModule,
    AvatarGroupModule,
    ConfirmPopupModule,
    ViewMyProfileComponent,
    AddBlogsComponent,
    RouterLink,
    TooltipModule,
    AddProjectsComponent,
    ChartComponentComponent,
    CommonModule,
    ViewAllUserComponent,
    FormsModule,
    ToggleSwitchModule,

],
  providers: [ConfirmationService, MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  blogsListData: BlogsResponse[] = [];
  projectListData: ProjectResponse[] = [];
  title = signal<string>('Dashboard');
  isBlogs = signal<boolean>(false);
  isProjectsShowable = signal<boolean>(false);
  isSlideBarCollapsed = signal<boolean>(false);
  iconChange = signal<boolean>(false);
  myData: MyDetailsResponse | null = UserStorageService.getMyData();
  newUserCount = signal<number>(0);
  items: MenuItem[''] | undefined;
  userData!: FormGroup;
  dialogVisible = false;
  loading = false;
  isShowProfile = signal<boolean>(false);
  coverImg: File | null | any = null;
  imageSrc = 'data:image/png;base64,' + this.myData?.returnImg;
  myOwnData: any | null = UserStorageService.getMyData();
  first = 0;
  rows = 10;
  isShowBlogForms = signal<boolean>(false);
  loadingId: number | null = null;
  blogsId: number | any;
  isShow = signal<boolean>(false);
  ListOfNewUserData: newUserData[] = [];
  defaultShow=signal<boolean>(true);
  showAllUser=signal<boolean>(false);
  userReloadCount=0;
  showMenu:boolean=false;
  constructor(
    private share: StateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private userStorageService: UserStorageService,
    private myDetailsService: MyDetailsServiceService,
    private myBlogsService: BlogsServiceService,
    private myProjectService: ProjectsServiceService,
    private router: Router
  ) {
    
  }
  ngOnInit() {
    this.onEnter();
    this.userData = this.fb.group({
      email: [this.myData?.email, Validators.required],
      name: [this.myData?.name, Validators.required],
      specialized: [this.myData?.specialized, Validators.required],
      description: [this.myData?.description, Validators.required],
    });
  
  }
  ngAfterViewInit(){
    this.getAllBlogs(this.first, this.rows);
    this.getAllProjects();
    this.getNoOfNewUser();
  }
  showNewBlogForm() {
    this.isShowBlogForms.set(true);
  }
  showNewProjectForm() {
    this.isShow.set(true);
  }
  changeIsShow(event: boolean) {
    this.isShow.set(event);
  }
  changeStatus(event: boolean) {
    this.isShowBlogForms.set(event);
    console.log(
      'this is dashboard changeStatu method:: ',
      this.isShowBlogForms()
    );
  }
  viewAllUser(value:boolean){
    this.isBlogs.set(false);
    this.isProjectsShowable.set(false);
    this.isShowProfile.set(false);
    this.defaultShow.set(false)
    this.showAllUser.set(true);
    this.title.set("Users");
    this.userReloadCount++;
  }

  onEnter() {
    this.items = [
      {
        label: 'Update Profile',
        icon: 'pi pi-refresh',
        command: () => {
          this.dialogVisible = true;
        },
      },
      {
        label: 'View Profile',
        icon: 'pi pi-eye',
        command: () => {
          this.isShowProfile.set(true);
          this.isBlogs.set(false);
          this.isProjectsShowable.set(false);
          this.defaultShow.set(false);
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: () => {
         UserStorageService.logout();
         this.share.setShowComponent(false);
         this.router.navigateByUrl('');
        },
      },
    ];
  }
  menuToggle(){
    this.showMenu=!this.showMenu;
  }
  hidePage() {
    this.isShowProfile.set(false);
    this.messageService.add({
      severity: 'info',
      summary: 'Profile closed',
      detail: 'Closed Profile',
      life: 3000,
    });
  }
  //Pagination
  next() {
    this.first = this.first++;
    this.getAllBlogs(this.first, this.rows);
  }

  prev() {
    this.first = this.first--;
    this.getAllBlogs(this.first, this.rows);
  }

  reset() {
    this.first = 0;
    this.getAllBlogs(this.first, this.rows);
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.projectListData
      ? this.first + this.rows >= this.projectListData.length
      : true;
  }

  isFirstPage(): boolean {
    return this.projectListData ? this.first === 0 : true;
  }

  viewAllBlogs() {
    this.title.set('Blogs');
    this.isBlogs.set(true);
    this.isProjectsShowable.set(false);
    this.isShowProfile.set(false);
    this.defaultShow.set(false)
     this.showAllUser.set(false);
    this.getAllBlogs(this.first, this.rows);
  }
  getAllBlogs(first: any, row2: any) {
    this.myBlogsService.getAllBlogsByAdmin(first, row2).subscribe({
      next: (value: any) => {
        this.blogsListData = value.content;
        for (let blogs of this.blogsListData) {
          if (blogs.description.length > 20) {
            blogs.description = blogs.description.slice(0, 20) + '...';
          }
        }
      },
    });
  }
  toggleVisibilityBlog(blogId:any, isVisible:any){
     const formData=new FormData();
    formData.append('show',isVisible);
    this.myBlogsService.updateBlogsShowStatus(blogId,formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:"Updated",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Failed",detail:error.message,life:3000});
      }
    })
  }
  viewAllProjects() {
    this.title.set('Projects');
    this.isBlogs.set(false);
    this.isShowProfile.set(false);
    this.defaultShow.set(false);
     this.showAllUser.set(false);
    this.isProjectsShowable.set(true);
  }

  getAllProjects() {
    this.myProjectService.getAllProjectsByAdmin(this.first, this.rows).subscribe({
      next: (data: any) => {
        this.projectListData = data.content;
        this.projectListData.forEach((projectData) => {
          if (projectData.description.length > 21) {
            projectData.description =
              projectData.description.slice(0, 20) + '...';
          }
          projectData.returnCoverImg =
            'data:image/png;base64,' + projectData.returnCoverImg;
          projectData.returnDemoImg =
            'data:image/png;base64,' + projectData.returnDemoImg;
        });
      },
    });
  }

  toggleVisibilityProject(projectId:number,isVisible:any){
    const formData=new FormData();
    formData.append('show',isVisible);
    this.myProjectService.updateProjectShowStatus(projectId,formData).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:"Updated",detail:value.message,life:3000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Error",detail:error.message,life:3000});
      }
    })
  }

  deleteProjectById(event: any, projectsId: any) {
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
        this.myProjectService.deleteProject(projectsId).subscribe({
          next: (data: any) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: data.message,
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong in deleting project',
            });
          },
        });
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
  toggleSlidbar() {
    this.isSlideBarCollapsed.set(!this.isSlideBarCollapsed());
    this.iconChange.set(!this.iconChange());
  }

  saveUserInfo() {
    if (this.userData.valid) {
      this.loading = true;
      this.myDetailsService
        .updateProfile(this.myOwnData.id, this.userData.value)
        .subscribe({
          next: (value: any) => {
            this.loading = false;
            this.userStorageService.saveMyData(value);
            this.messageService.add({
              severity: 'info',
              summary: 'Update Profile',
              detail: 'Updated Profile successfully',
              life: 3000,
            });
          },
        });
    }
  }
  deleteBlogs(blogsDataId: any) {
    this.loadingId = blogsDataId;
    this.myBlogsService.deleteBlogs(blogsDataId).subscribe({
      next: (value: any) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Deleted',
          detail: value.message,
          life: 3000,
        });
        this.loadingId = null;
      },
    });
  }
  updateBlogs(blogsId: any): void {
    this.blogsId = blogsId;
  }

  logout() {
    UserStorageService.logout();
    this.messageService.add({
      severity: 'warn',
      summary: 'Logout',
      detail: 'Logout successfully',
      life: 1000,
    });
    this.router.navigateByUrl('/');
  }

  onFileSelected(event: any): void {
    this.coverImg = event.target.files[0];
    if (this.coverImg) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(this.coverImg);
    }
    this.uploadImage();
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.coverImg);
    this.myDetailsService
      .uploadProfileImg(this.myOwnData.id, formData)
      .subscribe({
        next: (value: any) => {
          console.log('this updateImage with response Data: ', value);
          this.userStorageService.saveMyData(value as MyDetailsResponse);
          this.messageService.add({
            severity: 'info',
            summary: 'Update detail',
            detail: 'Your profile is updated successfully',
            life: 3000,
          });
        },
      });
  }
  hideUploadPage() {
    console.log('this button is click');
    this.dialogVisible = false;
  }
  getNoOfNewUser() {
    this.myDetailsService.getNoOfNewUser().subscribe({
      next: (value: any) => {
        console.log("the total value is: "+value);
        this.newUserCount.set(value);
      },
    });
  }
  getUserIdAndName() {
    this.myDetailsService.getUserIdAndName().subscribe({
      next: (value: any) => {
        this.ListOfNewUserData = value;
        console.log(value);
        const message = this.ListOfNewUserData.map((userData) => ({
          severity: 'info',
          summary: 'New Users',
          detail: userData.name + 'is a new User',
          sticky:true,
          data:{userId:userData.id,type:'new-user'}
        }));
        this.messageService.addAll(message);
      },
      error:(value:any)=>{
        this.messageService.add({severity:"error",summary:"Error",detail:"Somethings went wrong in fetch new user",life:3000});
      }
    });
  }
  updateNewUser(event:any){
    console.log("click update?")
    const messageDate= event.message?.data;
    if(messageDate?.type==='new-user' && messageDate?.userId)
    {
      const userId=messageDate.userId;
      this.myDetailsService.updateNewUserStatus(userId,false).subscribe({
        next:(value:any)=>{
          this.newUserCount.update(value=>value-1);
        },error:(error:any)=>{
           this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update status for user ${userId}`,
          life: 3000
        });
        }
      })
    }
  }

  
}
