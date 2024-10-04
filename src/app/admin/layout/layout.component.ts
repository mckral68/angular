import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './../../ui/components/shared/navbar/navbar.component';
import { FooterComponent } from './../../ui/components/shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'], standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.querySelectorAll('a').forEach(el => {
      el.setAttribute("aria-label", "close");
      el.setAttribute("data-bs-dismiss", "offcanvas");
    })
  }

}
