import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'favorite-prd-remove-dialog',
  templateUrl: './favorite-prd-remove-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class FavoritePrdDialogComponent
  extends BaseDialog<FavoritePrdDialogComponent>
  implements OnDestroy
{
  constructor(
    dialogRef: MatDialogRef<FavoritePrdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FavoritePrdDeleteState,
  ) {
    super(dialogRef);
  }

  ngOnDestroy(): void {}
}

export enum FavoritePrdDeleteState {
  Yes,
  No,
}
