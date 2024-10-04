import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  encapsulation:ViewEncapsulation.None,
  styleUrls: ['./faq.component.scss'], standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FaqComponent {

}
