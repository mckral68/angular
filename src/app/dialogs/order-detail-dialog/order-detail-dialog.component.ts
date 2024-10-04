import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SingleOrder } from '../../contracts/order/single_order';
import { OrderService } from '../../services/common/models/order.service';
import { CustomToastrService } from '../../services/ui/custom-toastr.service';
import { BaseDialog } from '../base/base-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
  ],
})
export class OrderDetailDialogComponent
  extends BaseDialog<OrderDetailDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private toastrService: CustomToastrService
  ) {
    super(dialogRef);
  }

  singleOrder: SingleOrder;

  displayedColumns: string[] = [
    'name',
    'color',
    'size',
    'quantity',
    'price',
    'totalPrice',
  ];
  dataSource: any[] = [];
  clickedRows = new Set<any>();
  totalPrice: number;

  async ngOnInit(): Promise<void> {
    this.singleOrder = await this.orderService.getOrderById(
      this.data as string
    );
    this.dataSource = this.singleOrder.orderItems;
  }

  completeOrder() {
    //   this.dialogService.openDialog({
    //     componentType: CompleteOrderDialogComponent,
    //     data: CompleteOrderState.Yes,
    //     afterClosed: async () => {
    //       this.spinner.show(SpinnerType.BallAtom)
    //       await this.orderService.completeOrder(this.data as string);
    //       this.spinner.hide(SpinnerType.BallAtom)
    //       this.toastrService.message("Sipariş başarıyla tamamlanmıştır! Müşteriye bilgi verilmiştir.", "Sipariş Tamamlandı!", {
    //         messageType: ToastrMessageType.Success,
    //         position: ToastrPosition.TopRight
    //       });
    //     }
    //   });
  }
}

export enum OrderDetailDialogState {
  Close,
  OrderComplete,
}
