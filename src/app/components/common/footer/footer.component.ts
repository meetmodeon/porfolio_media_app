import { Component } from '@angular/core';
import { StateService } from '../state/state.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(private stateService:StateService){}

  showContactDialog(){
    this.stateService.triggerContactDialog();
  }

}
