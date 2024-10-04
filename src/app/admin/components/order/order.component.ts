import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';
import { List_Order } from 'app/contracts/order/list_order';
import { OrderService } from 'app/services/common/models/order.service';
import { OrderDetailDialogComponent } from 'app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from 'app/services/common/dialog.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    DeleteDirectiveModule,
  ],
  providers: [DialogService],
})
export class OrderComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private dialogService: DialogService
  ) {
    super(spinner);
  }
  displayedColumns: string[] = [
    'orderNumber',
    'userName',
    'totalPrice',
    'Address',
    'createdDate',
    'completed',
    'viewdetail',
    'delete',
  ];
  transactStatus: Array<{ name: string; value: number }> = [
    { name: 'Sipariş Alındı', value: 0 },
    { name: 'Sipariş Hazırlanıyor', value: 1 },
    { name: 'Kargoya Verildi', value: 2 },
    { name: 'Teslim Edildi', value: 3 },
    { name: 'İptal Edildi', value: 4 },
    { name: 'İade Edildi', value: 5 },
  ];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  async pageChanged() {
    await this.getOrders();
  }

  async ngOnInit() {
    await this.getOrders();
  }
  async getOrders() {
    const allOrders: { totalOrderCount: number; orders: List_Order[] } =
      await this.orderService.getAllOrders(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => this.hideSpinner(SpinnerType.BallAtom)
      );
    // this.alertifyService.message(errorMessage.message, {
    //   dismissOthers: true,
    //   messageType: MessageType.Error,
    //   position: Position.TopRight
    // });
    await this.orderService.getAllOrders(1, 5);
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
  }
  getOrderList(a: any) {
    this.dataSource.filter = a.target.value;
  }
  showDetail(id: string) {
    this.dialogService.openDialog({
      componentType: OrderDetailDialogComponent,
      data: id,
      options: {
        width: '950px',
        height: '300px',
      },
    });
  }
  async updateStatus(a: string, b: any) {
   await this.orderService.updateOrderByAdmin(a,b.target.value)
  }
}
