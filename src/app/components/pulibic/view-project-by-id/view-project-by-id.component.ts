import { Component } from '@angular/core';
import { ProjectResponse } from '../../../modules/project-response';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-project-by-id',
  imports: [
     CardModule, ButtonModule,
    Toast,
    RouterLink,
    CommonModule,
    
  ],
  providers:[MessageService],
  templateUrl: './view-project-by-id.component.html',
  styleUrl: './view-project-by-id.component.scss'
})
export class ViewProjectByIdComponent {
  projectId!:number|string|null;
  projectData!:ProjectResponse;

  constructor(private projectService:ProjectsServiceService,
    private activeRoute:ActivatedRoute,
    private messageService:MessageService
  ){}

  ngOnInit(){
    this.activeRoute.paramMap.subscribe((params)=>{
      this.projectId=params.get('id');
      if(this.projectId){
        this.getProjectById(this.projectId);
      }
    })
  }

  getProjectById(projectId:any){
    this.projectService.getProjectById(projectId).subscribe({
      next:(value:any)=>{
        this.projectData=value;
        this.projectData.createdAt=timeAgo(this.projectData.createdAt);
      },
      error:(error:any)=>{
        this.messageService.add({severity:'error',summary:"Error",detail:error.error,life:3000});
      }
    })
  }
  isImageAvailable():boolean{
    if(this.projectData.returnDemoImg !== null && this.projectData.returnCoverImg !== null){
      return true;
    }
    return false;
  }

}
export function timeAgo(date:number|string|Date):string{
  return formatDistanceToNow(new Date(date),{addSuffix:true});
}
