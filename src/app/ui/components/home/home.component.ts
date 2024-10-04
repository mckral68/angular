import { FooterComponent } from './../shared/footer/footer.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ProductsComponent, FooterComponent],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      this.end = true;
    }, 3500);
  }
  end: boolean = false;
}
