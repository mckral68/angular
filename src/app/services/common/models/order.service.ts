import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_Order } from '../../../contracts/order/create_order';
import { List_Order } from '../../../contracts/order/list_order';
import { SingleOrder } from '../../../contracts/order/single_order';
import { HttpClientService } from '../http-client.service';
import { AllOrderByUser } from 'app/contracts/order/allOrderByUser';
import { OrderDetail, OrderInfo } from 'app/contracts/order/orderDetail';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpCLientService: HttpClientService) {}
  async create(order: Create_Order): Promise<{ isSuccess: boolean }> {
    const observable: Observable<any> = this.httpCLientService.post(
      {
        controller: 'orders',
      },
      {
        addressId: order.addressId,
        payment: order.payment,
        creditCart: order.creditCart,
        orderBasket: order.orderBasket,
        userId: order.userId,
        price: order.price,
      }
    );

    return await firstValueFrom(observable);
  }

  async getAllOrders(
    page: number = 0,
    size: number = 5,
    successCallBack?: () => void
  ): Promise<{ totalOrderCount: number; orders: List_Order[] }> {
    const observable: Observable<{
      totalOrderCount: number;
      orders: List_Order[];
    }> = this.httpCLientService.get({
      controller: 'orders',
      queryString: `page=${page}&size=${size}`,
    });
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getAllOrdersByUserId(
    userId: string,
    successCallBack?: () => void
  ): Promise<{ orders: AllOrderByUser[] }> {
    const observable: Observable<{ orders: AllOrderByUser[] }> =
      this.httpCLientService.get(
        {
          controller: 'orders',
          action: 'GetAllOrdersByUserId',
        },
        userId
      );
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getDetailByOrderNumber(
    od: string,
    successCallBack?: () => void
  ): Promise<{ shipments: OrderDetail[]; info: OrderInfo }> {
    const observable: Observable<{
      shipments: OrderDetail[];
      info: OrderInfo;
    }> = this.httpCLientService.get(
      {
        controller: 'orders',
        action: 'GetOrderDetailByOrderNumber',
      },
      od
    );
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getOrderById(id: string) {
    const observable: Observable<SingleOrder> =
      this.httpCLientService.get<SingleOrder>(
        {
          controller: 'orders',
        },
        id
      );

    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }

  async completeOrder(id: string) {
    const observable: Observable<any> = this.httpCLientService.get(
      {
        controller: 'orders',
        action: 'complete-order',
      },
      id
    );

    await firstValueFrom(observable);
  }

  async updateOrderByAdmin(
    id: string,
    transactStatus: string
  ): Promise<{ isSucceded: boolean }> {
    const observable: Observable<any> = this.httpCLientService.put(
      {
        controller: 'orders',
        action: 'UpdateTransactStatus',
      },
      {
        id,
        transactStatus,
      }
    );

    return await firstValueFrom(observable);
  }
}
