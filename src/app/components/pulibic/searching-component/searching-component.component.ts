import { Component, signal } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProjectResponse } from '../../../modules/project-response';
import { BlogsResponse } from '../../../modules/blogs-response';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Divider } from 'primeng/divider';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-searching-component',
  imports: [AutoCompleteModule,
    CommonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './searching-component.component.html',
  styleUrl: './searching-component.component.scss'
})
export class SearchingComponentComponent {

  projectList:ProjectResponse[]=[];
  blogsList:BlogsResponse[]=[];
  showNoContent=false;
  virtualCars!: BlogsResponse[];
  noContent=signal<boolean>(false);

    sizes!: any[];

    selectedSize: any ='normal';
  

  constructor(private myDetailsService:MyDetailsServiceService,
    private router:Router
  ){}

  ngOnInit(){
     this.virtualCars = Array.from({ length: 10000 });
  }

  searching(words:Event){
    const keyboardEvent=words as KeyboardEvent;
    const input=keyboardEvent.target as HTMLInputElement;
    input.blur();
    const keywords=input.value.trim();
    console.log("searcning is click from searching components",keywords);
    this.myDetailsService.searching(keywords).subscribe({
      next:(value:any)=>{
        this.projectList=value.projects;
        this.blogsList=value.blogs;
        if(this.blogsList.length ===0 && this.projectList.length === 0){
          this.noContent.set(true);
        }
         if(this.blogsList.length >0 || this.projectList.length > 0){
          this.noContent.set(false);
        }
        console.log("this is project list data: ",this.projectList);
        console.log("this is blogs list Is:: ",this.blogsList);
      }
    })

  }
  

  viewProjectWithId(projectId:number|string){
    this.router.navigate(['common/viewProject',projectId]);
  }
  viewBlogWithId(blogId:number|string){
    this.router.navigate(['common/viewBlog',blogId]);
  }

}
function Signal(arg0: boolean) {
  throw new Error('Function not implemented.');
}

