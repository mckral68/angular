import { Create_Basket_Item } from './../../../contracts/basket/create_basket_item';
import { ProductService } from 'app/services/common/models/product.service';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Favorite_List } from 'app/contracts/create_product';
import { BasketService } from 'app/services/common/models/basket.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { FavoriteService } from 'app/services/common/models/favorite.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent extends BaseComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private basketService = inject(BasketService);
  private toastrService = inject(CustomToastrService);
  private favoriteService = inject(FavoriteService);

  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }
  favPrd: Favorite_List[]
  crtBitem: Create_Basket_Item
  favId: string
  async ngOnInit(): Promise<void> {
    await this.favoriteService.getByUserIdFavorite(JSON.parse(localStorage.getItem('customer'))?.id).then(a => this.favPrd = a.favoriteProducts)
  }
  async addBasket(id: string) {
    // this.crtBitem = { productId: id, quantity: 1,co }
    await this.basketService.add(this.crtBitem).then(a => this.toastrService.message("Başarılı", "Ürün Sepete eklendi.", { messageType: ToastrMessageType.Info, position: ToastrPosition.TopFullWidth }))
  }
  async redirect(p: Favorite_List) {
    this.router.navigate([p?.name.replaceAll(" ", "-").toLowerCase()], { queryParams: { p: p.prdId } });
  }
  remove(favId:string){
    this.favId=favId;
  }
  async removeFavPrd() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    await this.favoriteService.deleteFavorite(this.favId).then(() => this.favPrd.splice(this.favPrd.findIndex((p) => p.favId == this.favId), 1))
    this.toastrService.message("Seçtiğiniz ürün favorilerinizden çıkarıldı", "Başarılı", {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopFullWidth
    })
  }
}