import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from "./components/common/navbar/navbar.component";
import { FooterComponent } from "./components/common/footer/footer.component";
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from "./components/common/contatc/contact-us/contact-us.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, NavbarComponent, FooterComponent, CommonModule, ContactUsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PortfolioUi';
  currentUrl:string='';
  showNav:boolean=true;

  constructor(private router:Router){
    
  }
  ngOnInit(){
    this.router.events.pipe(
      filter(event=> event instanceof NavigationEnd)
    ).subscribe((event:any)=>{
      this.currentUrl=event.urlAfterRedirects;
      this.toggle();
    })
  }

  toggle(){
    const hideRoutes=['/admin','/admin/dashboard']
    this.showNav = !hideRoutes.includes(this.currentUrl);
  }
}
