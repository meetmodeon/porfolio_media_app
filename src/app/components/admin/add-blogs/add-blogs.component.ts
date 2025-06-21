import { Component,EventEmitter,Input,input,Output,Signal,signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { StateService } from '../../common/state/state.service';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';


@Component({
  selector: 'app-add-blogs',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ChipModule,
    Dialog,
        ButtonModule,
        InputTextModule,
        AvatarModule,
        ToastModule,
        ConfirmPopupModule,
        ReactiveFormsModule,
        CommonModule,
        TooltipModule
  ],
  providers:[MessageService],
  templateUrl: './add-blogs.component.html',
  styleUrl: './add-blogs.component.scss'
})
export class AddBlogsComponent {

  blogForm!:FormGroup;
  loading=false;
  visible= signal<boolean>(true);
  @Input() isShowBlogForms!:boolean;
  @Output() changeStatus=new EventEmitter<boolean>();
  @Output() blogsAdded=new EventEmitter<void>();
  @Input() blogId:number|null=null;
  

  constructor(private fb:FormBuilder,
    private shared:StateService,
    private blogsService:BlogsServiceService,
    private messsageService:MessageService
  ){}
  ngOnInit(){
    this.blogForm=this.fb.group({
      title:[null,Validators.required],
      description:[null,Validators.required],
      tags:this.fb.array([this.fb.control('',[Validators.required])])
    })
    
  }
  get dialogVisible() {
    return this.isShowBlogForms;
  }
  set dialogVisible(value:boolean){
    value?this.isShowBlogForms=value:this.isShowBlogForms=value;
    this.changeStatus.emit(this.isShowBlogForms)
  }

  get tags(){
    return this.blogForm.get('tags') as FormArray;
  }
  addTags(){
    this.tags.push(this.fb.control(''));
  }

  removeTags(index:number):boolean{
    this.tags.removeAt(index);
    return true;
  }

  hideDialog() {
    this.isShowBlogForms=false;
    this.changeStatus.emit(this.isShowBlogForms);
  }

  onSubmit(){
    this.loading=true;
    if(this.blogForm.valid && UserStorageService.isAuthenticate()){
       this.blogsService.addBlogs(this.blogForm.value).subscribe({
    next:(value:any)=>{
      this.loading=false;
      this.messsageService.add({severity:"info",summary:"Add Blogs",detail:value.message,life:2000});
      this.blogForm.reset();
      this.blogsAdded.emit();
      setTimeout(()=>{
        this.isShowBlogForms=false;
        this.changeStatus.emit(this.isShowBlogForms);
      },1000);
    },
    error:(error:any)=>{
      this.loading=false;
      this.messsageService.add({severity:"warn",summary:"Error",detail:"Something went wrong in adding blogs",life:3000})
    }
   })
    }else{
      this.loading=false;
      this.messsageService.add({severity:"danger",summary:"Invalid",detail:"Please fill the form with valid data",life:3000});
    }
  }


}


