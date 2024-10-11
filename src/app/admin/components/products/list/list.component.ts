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
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { SelectProductImageDialogComponent } from 'app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { RouterModule } from '@angular/router';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  Create_Product,
  Edit_Product,
  ReadImages,
} from 'app/contracts/create_product';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    DeleteDirective,
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

  @Output() editProduct = new EventEmitter<Edit_Product>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  async getProducts() {
    this.products = (await this.productService.read(0, 999)).products;
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

  paginatedItems: Create_Product[] = []; // Görüntülenen ürünler
  products: Create_Product[] = []; // Görüntülenen ürünler
  currentPage: number = 1;
  itemsPerPage: number = 5; // Sayfa başına gösterilecek ürün sayısı
  totalPages: number = 0;
  pages: number[] = [];
  async edit(product: Edit_Product) {
    this.editProduct.emit(product);
  }
  async ngOnInit() {
    await this.getProducts();
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.updatePaginatedItems();
    this.generatePageNumbers();
  }
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedItems = this.products.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  generatePageNumbers() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }
  showQRCode(productId: string) {
    this.dialogService.openDialog({
      componentType: QrcodeDialogComponent,
      data: productId,
      afterClosed: () => {},
    });
  }
}
