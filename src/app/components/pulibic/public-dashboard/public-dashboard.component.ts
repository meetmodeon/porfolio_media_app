import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { BlogsResponse } from '../../../modules/blogs-response';
import { ProjectResponse } from '../../../modules/project-response';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { formatDistanceToNow } from 'date-fns';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SearchingComponentComponent } from '../searching-component/searching-component.component';
import { Footer } from 'primeng/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-public-dashboard',
  imports: [
    CommonModule,
    NgTemplateOutlet,
    CardModule,
    DynamicDialogModule,
    RouterLink,
    SkeletonModule
    
  ],
  providers:[DialogService],
  templateUrl: './public-dashboard.component.html',
  styleUrl: './public-dashboard.component.scss'
})
export class PublicDashboardComponent{
  tab:number=1;
  isOverFlow=true
  projectListData:ProjectResponse[]=[];
  blogsListData:BlogsResponse[]=[];
  pageIndex:number=0
  lastPage:boolean=false;
  firstPage:boolean=false;

  ref:DynamicDialogRef| undefined;

  constructor(private projectService:ProjectsServiceService,
    private blogsService:BlogsServiceService,
    private userService:MyDetailsServiceService,
    private dialogService:DialogService,
    private activeRoute:ActivatedRoute,


  ){
    // const blogsData=this.activeRoute.snapshot.data['dataList'];
    // this.blogsListData=blogsData.content;
    // const projectDatas=this.activeRoute.snapshot.data['projectList']
    // this.projectListData=projectDatas.content;
  }
  ngOnInit(){
   this.getBlogs(this.pageIndex);
   this.getAllProject(this.pageIndex);
  }

  
  search(){
    this.ref = this.dialogService.open(SearchingComponentComponent, {
      header:'Searching items',
            width: '50vw',
            modal:true,
            closable:true,
            contentStyle:{overFlow:'auto'},
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            templates: {
                footer: Footer
            }
        });
        
       
  }
   ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
      }
  
  active(number:any){
    this.tab=number;
    console.log("the blog is active");
  }
  show(){
    this.isOverFlow=false;
  }

   getAllProject(page:number){

    this.projectService.getAllProjects(page).subscribe({
      next:(data:any)=>{
        this.projectListData=data.content;
        this.firstPage=data.first;
        this.lastPage=data.last;
        this.projectListData.forEach(project=>
            {
            project.title=project.title.trim()
            project.title=project.title.charAt(0).toUpperCase()+project.title.slice(1).toLowerCase();
            project.createdAt=timeAgo(project.createdAt);
            }
            )
          
      },
      error:(error:any)=>{
        console.log("Error to fetch project data"+error)
      }
    })
   }
  getBlogs(pageIndex:number){
      this.blogsService.getBlogs(pageIndex).subscribe({
        next:(data:any)=>{
          this.blogsListData=data.content;
          this.lastPage=data.last;
          this.firstPage=data.first;
          this.blogsListData.forEach(blogs=>
            {
            blogs.title=blogs.title.trim()
            blogs.title=blogs.title.charAt(0).toUpperCase()+blogs.title.slice(1).toLowerCase();
            blogs.createdAt=timeAgo(blogs.createdAt.toString());
            console.log("The create date:: ",blogs.createdAt)
            }
            )
          
         }
     })
    }

    isNew(date:string):boolean{
      if(date.includes('minute')||date.includes('hour') || date.match('1 day') || date.match('2 days')|| date.match('3 days')){
        return true;
      }
      return false;
    }

    
}
export function timeAgo(data:string):string{
  console.log("date type of ",typeof data);
  try {
    return formatDistanceToNow(new Date(data), { addSuffix: true });
  } catch {
    return data;    // or `'unknown'`, or return data as-is if you prefer
  }
}


