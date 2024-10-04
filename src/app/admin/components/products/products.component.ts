import { MatDialogModule } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'app/base/base.component';
import { HttpClientService } from 'app/services/common/http-client.service';
import { QrcodeReadingDialogComponent } from '../../../dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';
import { DialogService } from '../../../services/common/dialog.service';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Create_Product, Edit_Product } from 'app/contracts/create_product';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'], standalone: true,
  imports: [CommonModule, CreateComponent, MatDialogModule, RouterModule, ListComponent, MatSidenavModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatFormFieldModule],
  providers: [HttpClientService, QrcodeReadingDialogComponent, MatDatepickerModule, DialogService]
})
export class ProductsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService) {
    super(spinner)
  }

  ngOnInit(): void {

  }

  @ViewChild(ListComponent) listComponents: ListComponent;
  @ViewChild(CreateComponent) createComponent: CreateComponent;

  async createdProduct(createdProduct: Create_Product) {
    await this.listComponents.getProducts();
  }
  async editPrd(editPrd: Edit_Product) {
    await this.createComponent.editPrd(editPrd)
  }
  // showProductQrCodeReading() {
  //   this.dialogService.openDialog({
  //     componentType: QrcodeReadingDialogComponent,
  //     data: null,
  //     options: {
  //       width: "1000px"
  //     },
  //     afterClosed: () => { }
  //   });
  // }

}
