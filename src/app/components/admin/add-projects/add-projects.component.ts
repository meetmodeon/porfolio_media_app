import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, Signal, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProjectsServiceService } from '../../../service/project/projects-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-add-projects',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    ConfirmPopupModule,
    Dialog,
    ConfirmDialog,
    Avatar
],
  providers:[MessageService,ConfirmationService],
  templateUrl: './add-projects.component.html',
  styleUrl: './add-projects.component.scss'
})
export class AddProjectsComponent {
  projectForm!:FormGroup;
  profileImg:File|string|null=null;
  coverImg:File|string|any|null=null;
  imageUrl:string|any;
  coverUrl:string|any;
  loading=false;
  visible:boolean=false;
  imgMsg:string=''
  allowedType=['image/jpg','image/jpeg','image/png']
  @Input() isShown!:any;
  @Output() changeShow=new EventEmitter<boolean>();
  @Output() onProjectEmit=new EventEmitter<void>();
  

  constructor(
    private fb:FormBuilder,
    private projectService:ProjectsServiceService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService
  ){
    
  }
  ngOnInit(){
    this.projectForm=this.fb.group({
      title:['',Validators.required],
      description:['',Validators.required],
      sourceCodeLink:[''],
      liveDemoLink:[''],
      tags:this.fb.array([this.fb.control('',[Validators.required])]),
    })
  }

  get dialogVisible(){
    return this.isShown;
  }
  set dialogVisible(value:boolean){
    value?this.isShown=value:this.isShown=value;
    this.changeShow.emit(this.isShown);
  }

  hideDialog(){
    this.isShown=false;
    this.changeShow.emit(this.isShown);
  }

  get tags(){
    return this.projectForm.get('tags') as FormArray;
  }

  addTags(){
    console.log("hi tags")
    this.tags.push(this.fb.control(''));
  }
  removeTags(index:any){
    this.tags.removeAt(index);
  }

  handleImageChage(event:any){
    const input= event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      const file= input.files[0];
      const fileType=file.type;
     

      if(this.allowedType.includes(fileType) && file.size<2*1024*1024){
        this.profileImg=file;
        const reader=new FileReader();
        reader.onload=()=>{
          this.imageUrl=reader.result as string;
        };
        reader.readAsDataURL(this.profileImg);
      }else{
        this.profileImg=null;
        this.visible=true;
        this.imgMsg="Please upload image size 2MB or .jpg,.png,.jpeg format file";
     }
   }
  }
   handleImageChage2(event:any){
    this.visible=false;
    const input= event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      const file= input.files[0];
      const fileType=file.type;
     

      if(this.allowedType.includes(fileType) && file.size<2*1024*1024){
        this.coverImg=file;
        const reader=new FileReader();
        reader.onload=()=>{
          this.coverUrl=reader.result as string;
        };
        reader.readAsDataURL(this.coverImg);
      }else{
        this.coverImg=null;
        this.visible=true;
        this.imgMsg="Please upload image size 2MB or .jpg,.png,.jpeg format file";
     }
   }
  }
  ngSubmit(){
    this.loading=true;
    if(this.projectForm.valid){
      const formData= new FormData();
      formData.append('title',this.projectForm.get('title')?.value);
      formData.append('description',this.projectForm.get('description')?.value);
      formData.append('tags',this.projectForm.get('tags')?.value);
      formData.append('sourceCodeLink',this.projectForm.value.sourceCodeLink);
      formData.append('liveDemoLink',this.projectForm.value.liveDemoLink);
      if(this.profileImg !== null && this.profileImg !== ''){
        formData.append('coverFile',this.profileImg)
      }
      if(this.coverImg !== null && this.coverImg !== ''){
        formData.append('demoFile',this.coverImg);
      }
      console.log("FormData is :: ",this.projectForm.value);

      this.projectService.addProjects(formData).subscribe({
        next:(value:any)=>{
     
          this.loading=false;
          this.messageService.add({
            severity:'info',
            summary:"Added Project",
            detail:value.message,
            life:1000
          })
          setTimeout(()=>{
            this.projectForm.reset();
            this.isShown=false;
            this.onProjectEmit.emit();
            this.changeShow.emit(this.isShown);
          },1000);
        },
        error:(error:any)=>{
          this.loading=false;
          this.projectForm.reset();
          this.hideDialog();
          this.messageService.add({severity:'error',summary:'Error',detail:error.error,life:3000});
        }
      })
    }
  }
}
