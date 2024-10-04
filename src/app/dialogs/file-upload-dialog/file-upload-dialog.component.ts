import { MatButtonModule } from '@angular/material/button';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'], standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class FileUploadDialogComponent extends BaseDialog<FileUploadDialogComponent> {
  constructor(
    dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileUploadDialogState) {
    super(dialogRef)
  }

}

export enum FileUploadDialogState {
  Yes, No
}
