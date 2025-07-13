import { Component } from '@angular/core';
import { StateService } from '../state/state.service';
// import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-footer',
  imports: [
    //  QRCodeModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  qrValue="https://github.com/meetmodeon";

  constructor(private stateService:StateService){}

  showContactDialog(){
    this.stateService.triggerContactDialog();
  }

}
