import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './../../ui/components/shared/navbar/navbar.component';
import { FooterComponent } from './../../ui/components/shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

type Names = {
  name:string,
  routerLink:string
};

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
  nameList:Names[]=[{name:" Siteye Dön",routerLink:"/"},
    {name:"Sipariş İşlemleri",routerLink:"orders"},
    {name:"Müşteriler",routerLink:"customers"},
    {name:"Kategori İşlemleri",routerLink:"category"},
    {name:"Müşteri Soruları",routerLink:"sellerquestions"},
    {name:"Mesaj Konuları",routerLink:"subjects"},
    {name:"Kargo İşlemleri",routerLink:"shipment"},
    {name:"Yetkilendirme",routerLink:"authorize-menu"},
    {name:"Rol İşlemleri",routerLink:"roles"},
    {name:"Kullanıcılar",routerLink:"users"},
  ]
  ngOnInit(): void {
    document.querySelectorAll('a').forEach(el => {
      el.setAttribute("aria-label", "close");
      el.setAttribute("data-bs-dismiss", "offcanvas");
    })
  }

}
