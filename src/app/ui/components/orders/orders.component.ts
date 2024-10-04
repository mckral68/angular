import { MatDialogModule } from '@angular/material/dialog';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Create_Order, OrderBasket } from '../../../contracts/order/create_order';
import { DialogService } from '../../../services/common/dialog.service';
import { BasketService } from '../../../services/common/models/basket.service';
import { OrderService } from '../../../services/common/models/order.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../../services/ui/custom-toastr.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from 'app/services/common/models/address.service';
import { UserAddressDetails } from 'app/contracts/address';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { List_Basket_Item } from 'app/contracts/basket/list_basket_item';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [DialogService, provideNgxMask()],
})
export class OrdersComponent extends BaseComponent implements OnInit {
  private basketService = inject(BasketService);
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private orderService = inject(OrderService);
  private toastrService = inject(CustomToastrService);
  private router = inject(Router);
  total: number = 0;
  userAddressDetails: UserAddressDetails[];
  constructor(ngspinner: NgxSpinnerService) {
    super(ngspinner);
    this.asyncSendForm();
  }
  async ngOnInit(): Promise<void> {
    this.basketService.prevUrl.next(this.router.url);
    await this.getBasketItems();
    await this.getUserAddress();
  }
  basketItems: List_Basket_Item[];
  async getBasketItems() {
    this.basketItems = await this.basketService.get();
    this.total = this.basketItems
      .map((item) => item.price * item.quantity)
      .reduce((a, b) => a + b);
  }
  ay: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yil: number[] = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2023, 2034,
    2035, 2036, 2037, 2038, 2039, 2040,
  ];
  orderForm: FormGroup;
  asyncSendForm() {
    this.orderForm = this.fb.group({
      payment: [null, [Validators.required]],
      creditCart: this.fb.group({
        cartNo: [null, [Validators.required]],
        fullName: [null, [Validators.required]],
        creditCartTypeId: [1],
        creditCartMonth: [null, [Validators.required]],
        creditCartYear: [null, [Validators.required]],
        cvc: [
          null,
          [
            Validators.required,
            Validators.min(100),
            Validators.max(999),
            Validators.maxLength(3),
          ],
        ],
      }),
      price: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      sku: [null, [Validators.required]],
    });
  }
  orderBasket: OrderBasket[];
  async deneme() {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    const order: Create_Order = this.orderForm.value;
    order.addressId = this.userAddressDetails[0].id;
    order.payment = { isApproved: false, type: '1' };
    order.creditCart.creditCartTypeId = '1';
    order.userId = JSON.parse(localStorage.getItem('customer'))?.id;
    order.orderBasket = this.basketItems.map(
      ({ productId, quantity, price, colorId, sizeId, sku }) => ({
        ['productId']: productId,
        ['colorId']: colorId,
        ['sizeId']: sizeId,
        ['quantity']: quantity,
        ['unitPrice']: price,
        ['sku']: sku,
      })
    );
    order.price = this.basketItems
      .map((a) => a.quantity * a.price)
      .reduce((a, b) => a + b);
    await this.orderService
      .create(order)
      .then((a) =>
        a.isSuccess
          ? this.shoppingComplete()
          : this.toastrService.message(
              'Bir hata meydana geldi',
              'Sipariş Oluşturalamadı',
              {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopFullWidth,
              }
            )
      )
      .then(() => {
        this.hideSpinner(SpinnerType.LineScalePulseOut);
      });
  }

  async shoppingComplete() {
    this.orderForm.reset();
    this.router.navigateByUrl('/hesabim');
    sessionStorage.removeItem('basketItems');
    this.toastrService.message(
      'Siparişiniz başarıyla oluşturulmuştur.',
      'Sipariş Oluşturuldu',
      {
        messageType: ToastrMessageType.Info,
        position: ToastrPosition.BottomFullWidth,
      }
    );
  }
  async getUserAddress() {
    await this.addressService
      .getUserAddress(JSON.parse(localStorage.getItem('customer'))['id'])
      .then((a) => (this.userAddressDetails = a.addresses));
  }
}
