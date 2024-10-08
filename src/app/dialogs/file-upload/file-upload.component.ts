import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component,Input, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { FileUploadDialogComponent, FileUploadDialogState } from '../file-upload-dialog/file-upload-dialog.component';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { DialogService } from '../../services/common/dialog.service';
import { HttpClientService } from '../../services/common/http-client.service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  encapsulation:ViewEncapsulation.None,
  imports: [CommonModule,
    NgxFileDropModule,
    MatDialogModule, MatButtonModule]
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService) { }

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;
  public async selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.BallAtom)
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe(data => {
          const message: string = "Dosyalar başarıyla yüklenmiştir.";
          this.spinner.hide(SpinnerType.BallAtom);
          if (this.options.isAdminPage) {
            this.alertifyService.message(message,
              {
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.TopRight
              })
          } else {
            this.customToastrService.message(message, "Başarılı.", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            })
          }

        }, (errorResponse: HttpErrorResponse) => {
          const message: string = "Dosyalar yüklenirken beklenmeyen bir hatayla karşılaşılmıştır.";
          this.spinner.hide(SpinnerType.BallAtom)
          if (this.options.isAdminPage) {
            this.alertifyService.message(message,
              {
                dismissOthers: true,
                messageType: MessageType.Error,
                position: Position.TopRight
              })
          } else {
            this.customToastrService.message(message, "Başarsız.", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            })
          }

        });
      }
    });
  }

  //openDialog(afterClosed: any): void {
  //  const dialogRef = this.dialog.open(FileUploadDialogComponent, {
  //    width: '250px',
  //    data: FileUploadDialogState.Yes,
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    if (result == FileUploadDialogState.Yes)
  //      afterClosed();
  //  });
  //}

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
