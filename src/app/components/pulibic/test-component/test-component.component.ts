import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-test-component',
  imports: [
    SkeletonModule
  ],
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.scss'
})
export class TestComponentComponent {

//   ngAfterViewInit(){
//     window.addEventListener('load', () => {
//   document.querySelectorAll('[id^="box"]').forEach(box => {
//     box.classList.remove('opacity-0', 'translate-y-5');
//     box.classList.add('opacity-100', 'translate-y-0');
//   });
// });

//   }

}
