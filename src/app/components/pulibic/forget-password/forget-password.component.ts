import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtp } from 'primeng/inputotp';
import { ChangePasswordServiceService } from '../../../service/changePassword/change-password-service.service';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [
    StepsModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputOtp,
    FormsModule,
    ToastModule,

  ],
  providers:[MessageService],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  items: MenuItem[] | undefined;
  active = signal(0);
  changeData!: FormGroup;
  showPassword: boolean = false;
  otp: any;
  countdown: number = 30;
  resendDisabled: boolean = true;
  private timer: any;
  private message:string='';

  constructor(private fb: FormBuilder,
    private changePasswordService:ChangePasswordServiceService,
    private messageSerivce:MessageService,
    private router:Router,

  ) {}

  ngOnInit() {
    
    this.changeData = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.items = [
      {
        label: 'Forget Password Form',
      },
      {
        label: 'OTP',
      },
    ];
  }
  change() {
    if(this.changeData.valid){
       this.active.set(1);
       this.startCountdown();
      this.changePasswordService.generateOpt(this.changeData.get('email')?.value).subscribe({
        next:(value:any)=>{
          this.message=value.message;
          this.messageSerivce.add({severity:"success",summary:"OTP",detail:this.message,life:3000});
         
        },error:(error:any)=>{
          this.messageSerivce.add({severity:'error',summary:'Error',detail:error.message,life:3000});
        }
      })
    }
    
  }
  startCountdown() {
    this.resendDisabled = true;
    this.countdown = 60;

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.timer);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  resendCode() {
    if (this.resendDisabled) return;

    // ✅ Call your resend OTP API here
    this.change();
    this.otp='';
    // Restart the timer
    this.startCountdown();
  }
  back() {
    this.active.set(0);
  }
  onOtpComplete(value: string) {
    if (value.length === 6) {
      if(this.changeData.valid){
        const formData={
          email:this.changeData.get('email')?.value,
          newPassword:this.changeData.get('newPassword')?.value,
          otp:value
        }
        this.changePasswordService.changePassword(formData).subscribe({
          next:(msg:any)=>{
            this.message=msg.message;
            this.messageSerivce.add({severity:'success',summary:"Changed Password",detail:this.message,life:3000});
            this.router.navigateByUrl('/login');
          },error:(error:any)=>{
            console.log(error,"This change password error");
            this.messageSerivce.add({severity:'error',summary:"Error",detail:error.message,life:3000});
          }
        })
      }
    }
  }

  passwordMatchValidator(formsGroup: FormGroup) {
    const pass = formsGroup.get('newPassword')?.value;
    const confirmPass = formsGroup.get('confirmPassword')?.value;

    if (pass !== confirmPass) {
      formsGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      const errors = formsGroup.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          formsGroup.get('confirmPassword')?.setErrors(null);
        } else {
          formsGroup.get('confirmPassword')?.setErrors(errors);
        }
      }
    }

    return null;
  }
  passwordToggle() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
