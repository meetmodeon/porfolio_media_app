import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogsResponse } from '../../../modules/blogs-response';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { format } from 'path';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-view-blogs-by-id',
  imports: [
    CardModule, ButtonModule,
    Toast,
    RouterLink,

  ],
  providers:[MessageService],
  templateUrl: './view-blogs-by-id.component.html',
  styleUrl: './view-blogs-by-id.component.scss'
})
export class ViewBlogsByIdComponent {
  blogId:any;
  blogData!:BlogsResponse;

  constructor(private activeRoute:ActivatedRoute,
    private blogService:BlogsServiceService,
    private messageService:MessageService
  ){}

  ngOnInit(){
    this.activeRoute.paramMap.subscribe({
      next:(value:any)=>{
        this.blogId=value.get('id');
        if(this.blogId){
          this.getBlogById(this.blogId);
        }
      }
    })

   
  }

  getBlogById(blogId:any){
    this.blogService.getBlogById(blogId).subscribe({
      next:(value:any)=>{
        console.log(value,"The value of blogs");
        this.blogData=value;
        this.blogData.createdAt=timeAgo(this.blogData.createdAt);
      },
      error:(error:any)=>{
        this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error?.error || 'Failed to load blog.',
        life: 3000
      });
      }
    })
  }
}
export function timeAgo(date:string|number|Date):string{
  return formatDistanceToNow(new Date(date),{addSuffix:true})
}
