import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { SpinnerType } from '../../base/base.component';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.router.navigateByUrl('/giris');
            this.toastrService.message(
              'Bu işlemi yapmaya yetkiniz bulunmamaktadır!',
              'Yetkisiz işlem!',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
          case HttpStatusCode.NoResponse:
            this.toastrService.message(
              'Sunucuya bağlanmaya çalışırken bir hata meydana geldi.',
              'Bağlantı Hatası!',
              {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopFullWidth,
              }
            );
            break;
          case HttpStatusCode.BadRequest:
            this.toastrService.message(
              'Geçersiz istek yapıldı!',
              'Geçersiz istek!',
              {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopFullWidth,
              }
            );
            break;
          case HttpStatusCode.NotFound:
            this.toastrService.message(
              'Sayfa bulunamadı!',
              'Sayfa bulunamadı!',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.TopFullWidth,
              }
            );
            break;
          case HttpStatusCode.InternalServerError:
            this.toastrService.message(error.error.Message, 'Hata Alındı!', {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopFullWidth,
            });
            break;
          default:
            this.toastrService.message(error.error.Message, 'Hata!', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.TopFullWidth,
            });
            break;
        }
        this.spinner.hide(SpinnerType.BallAtom);
        return of(error);
      })
    );
  }
}
