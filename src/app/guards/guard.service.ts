import { Router, RouterStateSnapshot } from '@angular/router';
import {
  UserAuthService,
  _isAuthenticated,
} from 'app/services/common/models/user-auth.service';
import { Injectable, inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
declare const require: any;
@Injectable({
  providedIn: 'root',
})
export class GuardService {
  private jwtHelper = inject(JwtHelperService);
  private _user = inject(UserAuthService);
  private _router = inject(Router);
  private toastrService = inject(CustomToastrService);
  private decrypt(abc: any) {
    var CryptoTS = require('crypto-ts');
    var bytes = CryptoTS.AES.decrypt(abc, 'ogfdo@.,12_');
    var plaintext = bytes.toString(CryptoTS.enc.Utf8);
    return plaintext;
  }
  checkAuthentication() {
    return this._user.user.pipe(
      map((user) => {
        return (
          !!user && this.decrypt(user?.userEmail) == environment.adminEmail
        );
      }),
      tap((isAdmin) => {
        if (!isAdmin) {
          this._router.navigate(['/login']);
        }
      })
    );
  }
  checkAuth() {
    const token: string = localStorage.getItem('accessToken');
    const decodeToken = this.jwtHelper.decodeToken(token);
    const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);
    let expired: boolean;
    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }
    if (!_isAuthenticated) {
      this._router.navigate(['login'], {
        queryParams: { returnUrl: this._router.url },
      });
      this.toastrService.message(
        'Oturum açmanız gerekiyor!',
        'Yetkisiz Erişim!',
        {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight,
        }
      );
      return false;
    } else {
      return true;
    }
  }
}
