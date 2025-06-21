import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signin-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AvatarModule,
    ButtonModule,
    RouterLink

  ],
  providers:[MessageService],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.scss'
})
export class SigninFormComponent {

  userFormData!:FormGroup;
  profileImage!:File|any;
  profileUrl!:string|any;
  loading=false;
  textType=signal<boolean>(true);

  constructor(
    private myDetailsService:MyDetailsServiceService,
    private messageService:MessageService,
    private fb:FormBuilder,
    private router:Router,
    
  ){}
  ngOnInit(){
    this.userFormData=this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      specialized:['',[Validators.required]],
      description:['',[Validators.required,Validators.minLength(20)]],
      password:['',[Validators.required,Validators.minLength(8)]]
    })
  }

  selectedImage(Event:any){
    this.profileImage=Event.target.files[0];
    if(this.profileImage){
      const reader=new FileReader();
      reader.onload=()=>{
        this.profileUrl=reader.result as string;
      }
      reader.readAsDataURL(this.profileImage);
    }
  }

  onSave(){
    this.loading=true
    console.log(this.userFormData.value);
    
    if(this.userFormData.valid){
      const formData=new FormData();
      formData.append("name",this.userFormData.value.name);
      formData.append("email",this.userFormData.value.email);
      formData.append("password",this.userFormData.value.password);
      formData.append("specialized",this.userFormData.value.specialized);
      formData.append("description",this.userFormData.value.description);
      if(this.profileImage!== null){
        formData.append('file',this.profileImage);
      }
      this.myDetailsService.createNewAccount(formData).subscribe({
        next:(data:any)=>{
          this.loading=false;
          this.userFormData.reset();
          this.messageService.add({severity:'success',summary:"Registered",detail:"User Registered successfully",life:3000});
          this.router.navigateByUrl("/login");
        },
        error:(error:any)=>{
          this.messageService.add({severity:"error",summary:'Error',detail:error.error,life:3000});
        }
      })
    }
  }
  reset(){
    this.userFormData.reset();
  }
  showPassword(){
    console.log("show password")
    this.textType.update(value=>!value);
  }
}
