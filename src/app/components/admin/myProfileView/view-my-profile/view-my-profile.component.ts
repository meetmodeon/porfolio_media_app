import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserStorageService } from '../../../../service/userStorage/user-storage.service';

@Component({
  selector: 'app-view-my-profile',
  imports: [
    CardModule,
    ButtonModule,

  ],
  templateUrl: './view-my-profile.component.html',
  styleUrl: './view-my-profile.component.scss'
})
export class ViewMyProfileComponent {

  @Input() isProfileshow!:boolean;
  @Output() closePage= new EventEmitter<void>();
  myData=UserStorageService.getMyData();

  hidePage(){
    this.closePage.emit();
  }
}
