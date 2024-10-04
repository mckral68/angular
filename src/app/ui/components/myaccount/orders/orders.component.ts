import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from 'app/services/common/models/order.service';
import { AllOrderByUser } from 'app/contracts/order/allOrderByUser';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  providers: [ConvertEngPipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private convertEng = inject(ConvertEngPipe);
  private router = inject(Router);
  buttonSpans = [
    { name: 'Tümü', filter: 'All' },
    { name: 'Devam Edenler', filter: 'Continue' },
    { name: 'İptaller', filter: 'Cancelled' },
    { name: 'İadeler', filter: 'Return' },
  ];
  orderList: AllOrderByUser[];
  orderLists: AllOrderByUser[];
  activeBtn: number;
  async ngOnInit(): Promise<void> {
    await this.orderService
      .getAllOrdersByUserId(JSON.parse(localStorage.getItem('customer')).id)
      .then((a) => (this.orderList = a.orders));
    this.orderLists = this.orderList;
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      if (params.params.filter == 'All') {
        this.activeBtn = 0;
        this.orderList = this.orderLists;
      } else if (params.params.filter == 'Cancelled') {
        this.orderList = this.orderLists.filter((o) => o.transactStatus == 4);
        this.activeBtn = 2;
      }
    });
  }
  redirect(name: string, id: string) {
    this.router.navigate(['/' + this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
  async redirectTo(od: string) {
    this.router.navigate(['hesabim/siparislerim/' + od]);
  }
  filterOrder(f: string) {
    switch (f) {
      case 'All':
        this.activeBtn = 0;
        this.orderList = this.orderLists;
        return this.orderList;
      case 'Continue':
        this.activeBtn = 1;
        this.orderList = this.orderLists.filter(
          (o) =>
            o.transactStatus == 0 ||
            o.transactStatus == 1 ||
            o.transactStatus == 2
        );
        return this.orderList;
        break;
      case 'Cancelled':
        this.activeBtn = 2;
        this.orderList = this.orderLists.filter((o) => o.transactStatus == 4);
        return this.orderList;
      case 'Return':
        this.activeBtn = 3;
        this.orderList = this.orderLists.filter((o) => o.transactStatus == 5);
        return this.orderList;
      default:
        return this.orderLists;
    }
  }
}
