import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

declare var $: any;

@Component({
  selector: 'app-shopping-complete-dialog',
  templateUrl: './shopping-complete-dialog.component.html',
  styleUrls: ['./shopping-complete-dialog.component.scss'], standalone: true,
  imports: [MatDialogModule]
})
export class ShoppingCompleteDialogComponent extends BaseDialog<ShoppingCompleteDialogComponent> implements OnDestroy {

  constructor(dialogRef: MatDialogRef<ShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteState) {
    super(dialogRef)
  }

  show: boolean = false;
  complete() {
    this.show = true;
  }

  ngOnDestroy(): void {
    if (!this.show)
      $("#basketModal").modal("show");
  }
}

export enum ShoppingCompleteState {
  Yes,
  No
}
