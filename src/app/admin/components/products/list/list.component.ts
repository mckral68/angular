import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'app/services/common/dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { QrcodeDialogComponent } from '../../../../dialogs/qrcode-dialog/qrcode-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../../../services/admin/alertify.service';
import { ProductService } from '../../../../services/common/models/product.service';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { SelectProductImageDialogComponent } from 'app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { RouterModule } from '@angular/router';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Edit_Product, ReadImages } from 'app/contracts/create_product';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    DeleteDirectiveModule,
    SelectProductImageDialogComponent,
  ],
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {
    super(spinner);
  }
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'photos',
    'qrcode',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<Edit_Product> = null;
  @Output() editProduct = new EventEmitter<Edit_Product>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  async getProducts() {
    this.showSpinner(SpinnerType.BallAtom);
    const allProducts: { totalProductCount: number; products: Edit_Product[] } =
      await this.productService.read(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => this.hideSpinner(SpinnerType.BallAtom),
        (errorMessage) =>
          this.alertifyService.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
          })
      );
    this.hideSpinner(SpinnerType.BallAtom);
    this.dataSource = new MatTableDataSource<Edit_Product>(
      allProducts.products
    );
    this.paginator.length = allProducts.totalProductCount;
  }

  addProductImages(id: string, valueId: string) {
    const readImage: ReadImages = { id: id, attributeValueId: valueId };
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: readImage,
      options: {
        width: '1400px',
      },
    });
  }

  async pageChanged() {
    await this.getProducts();
  }
  async edit(product: Edit_Product) {
    this.editProduct.emit(product);
  }
  async ngOnInit() {
    await this.getProducts();
  }

  showQRCode(productId: string) {
    this.dialogService.openDialog({
      componentType: QrcodeDialogComponent,
      data: productId,
      afterClosed: () => {},
    });
  }
}
