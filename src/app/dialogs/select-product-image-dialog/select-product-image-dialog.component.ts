import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { List_Product_Image } from '../../contracts/list_product_image';
import { DialogService } from '../../services/common/dialog.service';
import {
  FileUploadOptions,
  FileUploadComponent,
} from '../file-upload/file-upload.component';
import { ProductService } from '../../services/common/models/product.service';
import { BaseDialog } from '../base/base-dialog';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../delete-dialog/delete-dialog.component';
import { Component, Inject, OnInit, Output } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ReadImages } from 'app/contracts/create_product';

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss'],
  standalone: true,
  providers: [DialogService],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    FileUploadComponent,
  ],
})
export class SelectProductImageDialogComponent
  extends BaseDialog<SelectProductImageDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReadImages,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg, .gif',
    action: 'upload',
    controller: 'products',
    explanation: 'Ürüne ait resmi seçin veya buraya sürükleyin...',
    isAdminPage: true,
    queryString: `id=${this.data.id}&attributeValueId=${this.data.attributeValueId}`,
  };

  images: List_Product_Image[];

  async ngOnInit() {
    this.images = await this.productService.readImages(this.data.id, () => '');
  }
  async deleteImage(imageId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        await this.productService.deleteImage(
          this.data.id,
          imageId,
          async () => {
            this.spinner.hide(SpinnerType.BallAtom);
            await this.productService
              .readImages(this.data.id)
              .then((a) => (this.images = a));
          }
        );
      },
    });
  }

  async showCase(imageId: string) {
    await this.productService.changeShowcaseImage(imageId, this.data.id);
  }
}

export enum SelectProductImageState {
  Close,
}
