import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { ProjectResponse } from '../../../modules/project-response';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-update-projects',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule

  ],
  providers:[MessageService],
  templateUrl: './update-projects.component.html',
  styleUrl: './update-projects.component.scss'
})
export class UpdateProjectsComponent {
  projectForm!:FormGroup;
  profileImg:File|null|any=null;
  coverImg:File|null|any=null;
  imageUrl:string|any;
  coverUrl:string|any;
  projectId:any


  constructor(private fb:FormBuilder,
    private acitveRoute:ActivatedRoute,
    private projectService:ProjectsServiceService,
    private messageService:MessageService,

  ){
    
  }
  ngOnInit(){
    this.projectForm=this.fb.group({
      title:[null,Validators.required],
      description:[null,Validators.required],
      tags:this.fb.array([this.fb.control('')]),
    })
    this.projectId=this.acitveRoute.snapshot.paramMap.get('id');
    this.getProjectById();
  }

  get tags(){
    return this.projectForm.get('tags') as FormArray;
  }

  addTags(){
    this.tags.push(this.fb.control(''));
  }
  removeTags(index:any){
    this.tags.removeAt(index);
  }

  handleImageChage(event:any){
    this.profileImg=event.target.files[0];
    if(this.profileImg){
      const reader=new FileReader();
      reader.onload=()=>{
        this.imageUrl=reader.result as string
      };
      reader.readAsDataURL(this.profileImg);
    }
  }
   handleImageChage2(event:any){
    this.coverImg=event.target.files[0];
    if(this.coverImg){
      const reader=new FileReader();
      reader.onload=()=>{
        this.coverUrl=reader.result as string
      };
      reader.readAsDataURL(this.coverImg);
    }
  }
  getProjectById(){
    this.projectService.getProjectById(this.projectId).subscribe({
      next:(data:ProjectResponse)=>{

        this.projectForm.patchValue({
          title:data.title,
          description:data.description
        });
        this.tags.clear();
        for(let tag of data.tags){
          this.tags.push(this.fb.control(tag));
        }
        this.imageUrl='data:image/jpeg;base64,'+data.returnCoverImg ;
        this.coverUrl='data:image/jpeg;base64,'+data.returnDemoImg;
      }
    })
  }
  onUpdate(){
    if(this.projectForm.valid){
     const formData=new FormData();
     formData.append('title',this.projectForm.get('title')?.value);
     formData.append('description',this.projectForm.get('description')?.value);
     formData.append('tags',this.projectForm.get('tags')?.value);
     formData.append('coverImg',this.profileImg)
     formData.append('demoImg',this.coverImg);
     this.projectService.updateProjects(this.projectId,formData).subscribe({
      next:(value:ProjectResponse)=>{
        this.messageService.add({severity:'info',summary:'Updated Project',detail:"Project id: "+this.projectId+" is updated sucessfully",life:1000});
      },
      error:(error:any)=>{
        this.messageService.add({severity:'danger',summary:"Erorr",detail:"something went wrong in update Project",life:1000});
      }
     })
    }
  }
}
