import { StorageBasket } from './../../../../contracts/basket/list_basket_item';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { List_Basket_Item } from 'app/contracts/basket/list_basket_item';
import { Create_Basket_Item } from 'app/contracts/basket/create_basket_item';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { environment } from 'environments/environment';
import { ProductService } from 'app/services/common/models/product.service';
import { List_Product } from 'app/contracts/list_product';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SimpleProduct } from 'app/contracts/simpleProduct';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatAutocompleteModule],
  providers: [ConvertEngPipe],
})
export class NavbarComponent implements OnInit {
  basketItems: List_Basket_Item[];
  basket$: Create_Basket_Item[] = [];
  basketCount: number = 0;
  isAuthenticated: boolean;
  isAdmin: boolean = false;
  listProducts: SimpleProduct[] = [];
  lastProducts: List_Product[] = [];
  isMobil: boolean = false;
  isSearchHide: boolean = false;
  isSearch: boolean = false;
  strBasket: StorageBasket;
  ustGiyim: string[] = [
    'Atlet',
    'Bluz',
    'Body',
    'Büstiyer',
    'Gömlek',
    'Hırka',
    'Kazak',
    'Süveter',
    'T-shirt',
    'Tunik',
  ];
  altGiyim: string[] = [
    'Alt Üst Takım',
    'Eşofman',
    'Etek',
    'Jean/Kot',
    'Gömlek',
    'Pantolon',
    'Şort',
    'Tayt',
  ];
  disGiyim: string[] = [
    'Ceket',
    'Kaban',
    'Mont',
    'Jean/Kot',
    'Trençkot',
    'Yağmurluk',
    'Yelek',
  ];
  filteredPrd: SimpleProduct[];
  private authService = inject(UserAuthService);
  private productService = inject(ProductService);
  private toastrService = inject(CustomToastrService);
  private router = inject(Router);
  private converPipe = inject(ConvertEngPipe);
  private location = inject(Location);

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (
          val.url.startsWith('/hesabim') ||
          val.url === '/' ||
          val.url === '/SifreGuncelleme' ||
          val.url.indexOf('yorumlar')
        ) {
          this.isSearch = true;
        } else {
          this.isSearch = false;
        }
        if (val.url === '/') {
          this.isSearchHide = true;
        } else {
          this.isSearchHide = false;
        }
      }
    });
    document.querySelectorAll('.nav-link a').forEach((el) => {
      el.setAttribute('aria-label', 'close');
      el.setAttribute('data-bs-dismiss', 'offcanvas');
    });
  }

  async ngOnInit(): Promise<void> {
    await this.decrypt();
    await this.authCheck();
    this.strBasket = JSON.parse(sessionStorage.getItem('basketItems')) ?? 0;
    this.basketCount = this.strBasket ? this.strBasket?.basketItems?.length : 0;
    window.innerWidth > 1000 ? (this.isMobil = false) : (this.isMobil = true);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth > 1000
      ? (this.isMobil = false)
      : (this.isMobil = true);
  }
  async onKey(event: any): Promise<void> {
    if (event.target.value.length >= 3) {
      this.filterPrd(event.target.value);
    }
  }
  private filterPrd(name: string) {
    this.productService
      .getProductByName(name)
      .then((a) => (this.filteredPrd = a.products));
    window.scrollTo(0, 0);
  }
  onLey(name: any): void {
    if (name.length >= 1) {
      this.filterPrd(name);
    }
  }
  async authCheck(): Promise<void> {
    this.isAuthenticated = await this.authService.identityCheck();
  }
  private async decrypt() {
    if (!!!JSON.parse(localStorage.getItem('customer'))) {
      return;
    } else {
      await this.authService
        .decrypt(JSON.parse(localStorage.getItem('customer'))['email'])
        .then(
          async (res) =>
            (this.isAdmin =
              res === environment.adminEmail &&
              (await this.authService.identityCheck()) == true)
        );
    }
  }
  async redirect() {
    (await this.authService.identityCheck())
      ? this.router.navigate(['/hesabim'])
      : this.router.navigate(['/giris']);
  }
  async signOut(): Promise<void> {
    {
      localStorage.clear();
      localStorage.removeItem('customer');
      this.authService.user.next(null);
      this.router.navigate(['']);
      this.toastrService.message('Oturum kapatılmıştır!', 'Oturum Kapatıldı', {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.BottomRight,
      });
      await this.authCheck();
    }
  }
  redirectTo(name: string, id: string) {
    this.router.navigate([this.converPipe.transform(name)], {
      queryParams: { p: id },
    });
  }
  getHome() {
    this.location.replaceState('/');
    this.productService._isHomePage.next(true);
  }
}
