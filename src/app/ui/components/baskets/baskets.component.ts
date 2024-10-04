import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { List_Product_Image } from 'app/contracts/list_product_image';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  List_Basket_Item,
  StorageBasket,
} from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { BasketService } from '../../../services/common/models/basket.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../../services/ui/custom-toastr.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'app/services/common/dialog.service';
import { Create_Favorite } from 'app/contracts/create_product';
import { DiscountService } from 'app/services/common/models/discount.service';
import { FavoriteService } from 'app/services/common/models/favorite.service';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [DialogService, ConvertEngPipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    NavbarComponent,
    NgOptimizedImage,
  ],
})
export class BasketsComponent extends BaseComponent implements OnInit {
  private userService = inject(UserAuthService);
  private basketService = inject(BasketService);
  private toastrService = inject(CustomToastrService);
  private router = inject(Router);
  private discountService = inject(DiscountService);
  private favoriteService = inject(FavoriteService);
  private convertEng = inject(ConvertEngPipe);
  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }
  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    this.kimliKontrol = await this.userService.identityCheck();
    if (this.kimliKontrol == false) {
      this.router.navigate(['/giris'], {
        queryParams: { returnUrl: 'sepetim' },
      });
      this.toastrService.message(
        'Sepetinizi görüntüleyebilmeniz için oturum açmalısınız',
        'Oturum Açınız',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomFullWidth,
        }
      );
    } else {
      await this.getBasketItems();
    }
    this.hideSpinner(SpinnerType.LineScalePulseOut);
  }
  discountName: string;
  discountAmount: number = 0;
  toplam: number = 0;
  async minus(basketItem: List_Basket_Item) {
    if (basketItem.quantity > 0) {
      basketItem.quantity -= 1;
      this.calculate();
      await this.basketService.updateQuantity(basketItem);
    }
    return;
  }
  basketItemId: string;
  productId: string;
  isDiscountApplied: boolean = false;
  basketItems: List_Basket_Item[];
  crtPrdFav: Create_Favorite;
  storageBasket: StorageBasket;
  kimliKontrol: boolean = false;
  imgPath: List_Product_Image[];
  basketItem: Update_Basket_Item = new Update_Basket_Item();

  async plus(basketItem: List_Basket_Item) {
    if (basketItem.quantity < 5) {
      basketItem.quantity += 1;
      this.calculate();
      await this.basketService.updateQuantity(basketItem);
    } else {
      this.toastrService.message('Maksimum ürün sayısına ulaşıldı', 'Uyarı', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.BottomRight,
      });
    }
  }
  async getBasketItems() {
    this.basketItems = await this.basketService.get();
    this.calculate();
  }
  public itemCount: number = 0;
  total: number = 0;
  async removeBasketItem() {
    await this.basketService
      .remove(this.basketItemId)
      .then(() => this.getBasketItems());
  }

  async createPrdFavorite() {
    this.crtPrdFav = {
      productId: this.productId,
      userId: JSON.parse(localStorage.getItem('customer'))?.id,
    };
    await this.favoriteService.createPrdFavorite(this.crtPrdFav).then((a) =>
      a.isSuccess
        ? this.toastrService.message(
            'Ürün başarıyla favorilerinize eklendi.',
            'Başarılı',
            {
              messageType: ToastrMessageType.Info,
              position: ToastrPosition.TopFullWidth,
            }
          )
        : this.toastrService.message(
            'Ürün favorileriniz arasında.',
            'Favorilerinizde.',
            {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopFullWidth,
            }
          )
    );
    await this.removeBasketItem();
  }
  remove(basketItemId: string, productId: string) {
    this.basketItemId = basketItemId;
    this.productId = productId;
  }
  async calculate() {
    this.itemCount = 0;
    this.total = 0;
    this.basketItems.forEach((item) => {
      if (item.quantity < 6) {
        this.itemCount += item.quantity;
        this.total += item.quantity * item.price;
      } else {
        this.itemCount = 5;
        this.total += item.quantity * item.price;
      }
    });
    this.storageBasket = {
      basketItems: this.basketItems,
      totalFee: this.total,
      quantity: this.itemCount,
    };
    sessionStorage.setItem('basketItems', JSON.stringify(this.storageBasket));
  }
  applyDiscount(name: string) {
    this.discountService.getDiscountByName(name).then((a) => {
      if (a.isSucceded && this.isDiscountApplied == false) {
        this.discountName = '';
        if (this.total > a.coupon.lowerLimit) {
          this.isDiscountApplied = true;
          this.discountAmount = a.coupon.discountAmount;
        }
      } else {
        this.toastrService.message(
          'Üzgünüz böyle bir indirim bulunamadı.',
          'İndirim Bulunamadı',
          {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopFullWidth,
          }
        );
      }
    });
    
  }
  removeDiscount() {
    this.isDiscountApplied = false;
    this.discountAmount = 0;
    this.calculate();
  }
  redirect(name: string, id: string) {
    this.router.navigate(['/' + this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
}
