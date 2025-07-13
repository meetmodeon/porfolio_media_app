import { Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DashboardComponent as CommonDashboard } from './components/common/dashboard/dashboard.component';
import { AllBlogsComponent } from './components/common/all-blogs/all-blogs.component';
import { LoginPageComponent } from './components/admin/login-page/login-page.component';
import { AllProjectsComponent } from './components/common/all-projects/all-projects.component';
import { AddBlogsComponent } from './components/admin/add-blogs/add-blogs.component';
import { AddProjectsComponent } from './components/admin/add-projects/add-projects.component';
import { ContactUsComponent } from './components/common/contatc/contact-us/contact-us.component';
import { UpdateBlogsComponent } from './components/admin/update-blogs/update-blogs.component';
import { UpdateProjectsComponent } from './components/admin/update-projects/update-projects.component';
import { authGuardGuard } from './auth/auth-guard.guard';
import { PublicDashboardComponent } from './components/pulibic/public-dashboard/public-dashboard.component';
import { ViewAllUserComponent } from './components/admin/view-all-user/view-all-user.component';
import { SigninFormComponent } from './components/common/signin-form/signin-form.component';
import { ViewMyProfileComponent } from './components/common/view-my-profile/view-my-profile.component';
import { TestComponentComponent } from './components/pulibic/test-component/test-component.component';
import { SearchingComponentComponent } from './components/pulibic/searching-component/searching-component.component';
import { ViewBlogsByIdComponent } from './components/pulibic/view-blogs-by-id/view-blogs-by-id.component';
import { ViewProjectByIdComponent } from './components/pulibic/view-project-by-id/view-project-by-id.component';
import { CommonErrorComponent } from './components/pulibic/common-error/common-error.component';
import { BlogResolverService } from './core/resolver/blog-resolver.service';
import { ProjectResolverService } from './core/resolver/project-resolver.service';
import { Oauth2LoginComponent } from './components/common/oauth2-login/oauth2-login.component';
import { ForgetPasswordComponent } from './components/pulibic/forget-password/forget-password.component';

export const routes: Routes = [
    {
        path:"",
        pathMatch:"full",
        redirectTo:"public/dashboard"
    },
    
    {
        path:"public/dashboard",
        component:PublicDashboardComponent,
        // resolve:{
        //     dataList: BlogResolverService,
        //     projectList:ProjectResolverService
        // }
    },
    {
        path:"common/dashboard/:id",
        component:CommonDashboard
    },
    {
        path:"common/search",
        component:SearchingComponentComponent
    },
    {
      path:"common/viewBlog/:id"  ,
      component:ViewBlogsByIdComponent
    },
    {
        path:"common/viewProject/:id",
        component:ViewProjectByIdComponent
    },
    {
        path:'signin',
        component:SigninFormComponent
    },
    {
        path:"viewAllUser",
        component:ViewAllUserComponent
    },
    {
        path:"allBlogs",
        component:AllBlogsComponent
    },
    {
        path:"login",
        component:LoginPageComponent
    },
    {
        path:"allProjects",
        component:AllProjectsComponent
    },
    {
        path:"admin/dashboard",
        component:DashboardComponent,
        canActivate:[authGuardGuard]
    },
    {
        path:"admin/addBlogs",
        component:AddBlogsComponent
    },
    {
        path:"admin/addProjects",
        component:AddProjectsComponent
    },
    {
        path:"contact",
        component:ContactUsComponent
    },
    {
        path:'oauth2/callback',
        component:Oauth2LoginComponent
    },
    {
        path:'forgetPassword',
        component:ForgetPasswordComponent
    },
    {
        path:'admin/updateBlogs/:id',
        component:UpdateBlogsComponent,
        canActivate:[authGuardGuard]
    },
    {
        path:'admin/updateProjects/:id',
        component:UpdateProjectsComponent,
        canActivate:[authGuardGuard]
    },
    {
        path:'viewMyProfile',
        component:ViewMyProfileComponent
    },
    {
        path:"test",
        component:TestComponentComponent
    },
    {
        path:"not-found",
        component:CommonErrorComponent
    },
    {
        path:"**",
        redirectTo:"/not-found"
    },
    
    
];
