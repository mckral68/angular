import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './../../ui/components/shared/navbar/navbar.component';
import { FooterComponent } from './../../ui/components/shared/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

type Names = {
  name: string;
  routerLink: string | null;
  subItems?: Names[];
};

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);
  nameList: Names[] = [
    { name: 'Siteye Dön', routerLink: '/' },
    {
      name: 'Ürün İşlemleri',
      routerLink: null,
      subItems: [
        { name: 'Ürünler', routerLink: 'products' },
        { name: 'Ürün Yorumları', routerLink: 'comments' },
        { name: 'Ürün Soruları', routerLink: 'questions' },
        { name: 'Ürün Varyasyon', routerLink: 'attribute' },
        { name: 'Kategori İşlemleri', routerLink: 'category' },
      ],
    },
    { name: 'Sipariş İşlemleri', routerLink: 'orders' },
    { name: 'Müşteriler', routerLink: 'customers' },
    { name: 'Müşteri Soruları', routerLink: 'sellerquestions' },
    { name: 'Mesaj Konuları', routerLink: 'subjects' },
    { name: 'Kargo İşlemleri', routerLink: 'shipment' },
    { name: 'Yetkilendirme', routerLink: 'authorize-menu' },
    { name: 'Rol İşlemleri', routerLink: 'roles' },
    { name: 'Kullanıcılar', routerLink: 'users' },
  ];
  openSubItems: { [key: string]: boolean } = {};

  toggleSubItems(name: string) {
    this.openSubItems[name] = !this.openSubItems[name];
  }

  getId(name: string): string {
    return name.replace(/\s+/g, ''); // Boşlukları kaldır
  }
  handleItemClick(item: Names) {
    if (item.subItems) {
      this.toggleSubItems(item.name);
    } else {
      this.router.navigate(['admin/' + item.routerLink]);
    }
  }
  ngOnInit(): void {
    document.querySelectorAll('a').forEach((el) => {
      el.setAttribute('aria-label', 'close');
      el.setAttribute('data-bs-dismiss', 'offcanvas');
    });
  }
}
