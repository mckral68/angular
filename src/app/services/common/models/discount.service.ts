import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { Discount } from './discount.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  constructor(private httpClientService: HttpClientService) {}
  async create(discount: Discount, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'discount',
      },
      discount
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { isSucceeded: boolean };
  }
  async getAllDiscounts(
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ discounts: Discount[] }> {
    const observable: Observable<{ discounts: Discount[] }> =
      this.httpClientService.get({
        controller: 'discount',
      });
    return await firstValueFrom(observable);
  }
  async update(
    discount: Discount,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'discount',
      },
      { discount: discount }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async remove(id: string): Promise<void> {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'discount',
      },
      id
    );
    await firstValueFrom(observable);
  }
  async getDiscountByName(
    name: string
  ): Promise<{ coupon: Discount; isSucceded: boolean }> {
    const observable: Observable<{ coupon: Discount; isSucceded: boolean }> =
      this.httpClientService.get(
        {
          controller: 'discount',
          action: 'ApplyDiscount',
        },
        name
      );
    return await firstValueFrom(observable);
  }
}
