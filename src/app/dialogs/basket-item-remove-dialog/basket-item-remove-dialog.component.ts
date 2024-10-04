import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-basket-item-remove-dialog',
  templateUrl: './basket-item-remove-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class BasketItemRemoveDialogComponent
  extends BaseDialog<BasketItemRemoveDialogComponent>
  implements OnDestroy
{
  constructor(
    dialogRef: MatDialogRef<BasketItemRemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BasketItemDeleteState,
  ) {
    super(dialogRef);
  }

  ngOnDestroy(): void {}
}

export enum BasketItemDeleteState {
  Yes,
  No,
}
