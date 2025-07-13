import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router, RouterModule} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyDetailsServiceService } from '../../../service/myDetails/my-details-service.service';
import { LoginRequest } from '../../../modules/login-request';
import { ToastModule } from 'primeng/toast';
import { signal } from '@angular/core';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { MyDetailsResponse } from '../../../modules/my-details-response';
import { StateService } from '../../common/state/state.service';

@Component({
  selector: 'app-login-page',
  imports: [
    DividerModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule,
    

  ],
  providers: [MessageService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginForm!: FormGroup;
  showPassword = signal<boolean>(false);
  myData!: MyDetailsResponse;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private myDetailsService: MyDetailsServiceService,
    private userStorageService: UserStorageService,
    private stateService:StateService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onLogin() {
    const loginData: LoginRequest = this.loginForm.value;
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('myData');
    sessionStorage.removeItem('showComponent');
    this.myDetailsService.login(loginData).subscribe({
      next: (res: any) => {
        const token=res.jwtToken;
        this.userStorageService.saveToken(token);
        this.myData = {
          id:res.id,
          email:res.email,
          name:res.name,
          role:res.role,
          specialized:res.specialized,   
          returnImg:res.profileImg,
          returnImageName:res.returnImageName,
          returnImageType:res.returnImageType,
          description:res.description
        }
        ;
        this.userStorageService.saveMyData(this.myData);
        if(UserStorageService.isAuthenticate()){
          this.stateService.setShowComponent(true);
        }else{
          this.stateService.setShowComponent(false);
        }
        history.replaceState(null,'','/');
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back!',
          life: 1000,
        });

        if(UserStorageService.isAdminLoggedIn()){
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.router.navigate(['/common/dashboard',this.myData.id]);
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'Failed',
          summary: 'Bad credintail',
          detail: 'Enter correct Email and Password',
          life: 1000,
        });
      },
    });
  }
  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  signinForm(){
    console.log("click signin button")
    this.router.navigateByUrl('/signin');
  }
  loginWithGithub(){
    this.myDetailsService.loginWithGithub().subscribe({
      next:(value:any)=>{
        console.log("Successful login with github",value);
      }
    })
  }
  loginWithGoogle(){
    this.myDetailsService.loginWithGoogle().subscribe({
      next:(value:any)=>{
        console.log("Successfully login with google",value);
      }
    })
  }
}
