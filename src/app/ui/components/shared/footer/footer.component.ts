import { RouterModule } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./footer.component.scss'], standalone: true, imports: [
    RouterModule,
  ]
})
export class FooterComponent {


}
