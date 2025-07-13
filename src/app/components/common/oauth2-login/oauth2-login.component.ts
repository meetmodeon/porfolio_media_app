import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyDetailsResponse } from '../../../modules/my-details-response';
import { UserStorageService } from '../../../service/userStorage/user-storage.service';
import { MessageService } from 'primeng/api';
import { StateService } from '../state/state.service';

@Component({
  selector: 'app-oauth2-login',
  imports: [],
  providers:[MessageService],
  templateUrl: './oauth2-login.component.html',
  styleUrl: './oauth2-login.component.scss'
})
export class Oauth2LoginComponent {
  myData:MyDetailsResponse={
    id:'',
    email:'',
    name:'',
    specialized:'',
    role:'',
    description:'',
    returnImg:'',
    returnImageName:'',
    returnImageType:'',
    cvFile:'',
    cvFileName:'',
    
  };

constructor(private activeRoute:ActivatedRoute,
  private router:Router,
  private userStorageService:UserStorageService,
  private messageService:MessageService,
  private stateService:StateService,
){}

ngOnInit(){
  this.activeRoute.queryParams.subscribe({
    next:(param:any)=> {
        const token=param['token'];
        this.myData.id=param['id'];
        this.myData.email=param['email'];
        this.myData.name=param['name'];
        this.myData.role=param['role'];
        console.log("The detail of mySelf is:: ",this.myData)
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('myData');
        sessionStorage.removeItem('showComponent');
        this.userStorageService.saveMyData(this.myData);
        this.userStorageService.saveToken(token);
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
    error:(error:any)=>{
      this.messageService.add({severity:"error",summary:"Error",detail:error.message,life:3000});
    }
  })
}

}
