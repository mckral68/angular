import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { Create_Basket_Item } from '../../../contracts/basket/create_basket_item';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  constructor(private httpClientService: HttpClientService) { }
  prevUrl = new BehaviorSubject<string>(null)
  totalFee = new BehaviorSubject<number>(null)
  // async get(): Promise<List_Basket_Item[]> {
  //   const observable: Observable<List_Basket_Item[]> = this.httpClientService.get({
  //     controller: "baskets",
  //   });
  //   return await firstValueFrom(observable);
  // }
  async get() {
    const observable: Observable<List_Basket_Item[]> = this.httpClientService.get<List_Basket_Item[]>({
      controller: "baskets",
    });
    return await firstValueFrom(observable);
  }
async applyCoupon(id:string){
  const observable: Observable<any> = this.httpClientService.post({
    controller: "baskets"
  }, id);
  await firstValueFrom(observable);
}
  async add(basketItem: Create_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "baskets"
    }, basketItem);
    await firstValueFrom(observable);
  }

  async updateQuantity(basketItem: List_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.put({
      controller: "baskets"
    }, { BasketItemId: basketItem.basketItemId, Quantity: basketItem.quantity })

    await firstValueFrom(observable);
  }
  async remove(productId: string) {
    const observable: Observable<any> = this.httpClientService.delete({
      controller: "baskets"
    }, productId);

    await firstValueFrom(observable);
  }
}
