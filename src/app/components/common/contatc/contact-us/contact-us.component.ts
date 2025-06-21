import { Component, Signal } from '@angular/core';
import { StateService } from '../../state/state.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MyDetailsServiceService } from '../../../../service/myDetails/my-details-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-contact-us',
  imports: [
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
  providers:[ConfirmationService, MessageService],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  
  visible!: Signal<boolean>;
  ishide:boolean=true;
  userData!:FormGroup;
  loading=false;

  constructor(private shared: StateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private myDetailsService:MyDetailsServiceService,
    private fb:FormBuilder
  ) {}

  ngOnInit() {
    this.visible = this.shared.showContactDialog;
    this.userData=this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      address:[''],
      phoneNumber:['',[Validators.required,Validators.minLength(10)]],

    })
  }

  get dialogVisible() {
    return this.visible();
  }

  set dialogVisible(value: boolean) {
    value ? this.shared.triggerContactDialog() : this.shared.closeContactDialog();
  }

  hideDialog() {
    this.shared.closeContactDialog();
  }
  
    saveUserInfo(){
  
     if(this.userData.valid){
      this.loading=true;
      const userInfo={
        email:this.userData.get('email')?.value,
        phoneNumber:this.userData.get('phoneNumber')?.value.toString(),
        address:this.userData.get('address')?.value,
        name:this.userData.get('name')?.value
      }
      this.myDetailsService.saveUserInfo(userInfo).subscribe({
        next:(value:any)=>{
          this.loading=false;
          this.shared.increaseNewUserCount();
          this.messageService.add(({ severity: 'info', summary: 'Form Submitted!', detail: value.message, life: 2000 }))

          setTimeout(()=>{
           this.userData.reset();
           this.hideDialog()
          },2000)
        },
        error:(error:any)=>{
          this.messageService.add(({ severity: 'danger',summary:'Faild to Submitted',detail:error.message,life:2000}))
          setTimeout(()=>{
            this.hideDialog()
          },2000)
        }
      })
     }
    }

   
    increaseUser(){
      console.log("this button is increase user")
      this.shared.increaseNewUserCount();
      this.shared.newUserCount.subscribe(data=>{
        console.log(data);
      })
    }


}
