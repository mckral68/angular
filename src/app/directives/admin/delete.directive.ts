import { HttpErrorResponse } from '@angular/common/http';
import {
  EventEmitter,
  ElementRef,
  inject,
  Directive,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../../dialogs/delete-dialog/delete-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../services/admin/alertify.service';
import { DialogService } from '../../services/common/dialog.service';
import { HttpClientService } from '../../services/common/http-client.service';

declare var $: any;

@Directive({
  selector: '[appDelete]',
  standalone: true,
})
export class DeleteDirective {
  private element = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private httpClientService = inject(HttpClientService);
  private dialog = inject(MatDialog);
  private alertifyService = inject(AlertifyService);
  private dialogService = inject(DialogService);
  constructor(private spinner: NgxSpinnerService) {
    const i = this._renderer.createElement('i');
    i.setAttribute('class', 'fa-solid fa-trash');
    i.setAttribute('style', 'cursor: pointer;');
    i.width = 25;
    i.height = 25;
    this._renderer.appendChild(this.element.nativeElement, i);
  }

  @Input() id: string;
  @Input() controller: string;
  @Input() action: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        const td: HTMLTableCellElement = this.element.nativeElement;
        this.httpClientService
          .delete(
            {
              controller: this.controller,
              action: this.action,
            },
            this.id
          )
          .subscribe(
            (data) => {
              $(td.parentElement).animate(
                {
                  opacity: 0,
                  left: '+=50',
                  height: 'toogle',
                },
                700,
                () => {
                  this.callback.emit();
                  this.alertifyService.message(
                    `${
                      this.controller == 'roles' ? 'Rol' : 'Öge'
                    } başarıyla silinmiştir.`,
                    {
                      dismissOthers: true,
                      messageType: MessageType.Success,
                      position: Position.TopRight,
                    }
                  );
                }
              );
            },
            (errorResponse: HttpErrorResponse) => {
              this.spinner.hide(SpinnerType.BallAtom);
              this.alertifyService.message(
                'Ürün silinirken beklenmeyen bir hatayla karşılaşılmıştır.',
                {
                  dismissOthers: true,
                  messageType: MessageType.Error,
                  position: Position.TopRight,
                }
              );
            }
          );
      },
    });
  }

  //openDialog(afterClosed: any): void {
  //  const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //    width: '250px',
  //    data: DeleteState.Yes,
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    if (result == DeleteState.Yes)
  //      afterClosed();
  //  });
  //}
}
