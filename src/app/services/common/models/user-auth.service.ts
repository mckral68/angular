import { environment } from 'environments/environment';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { List_Basket_Item } from 'app/contracts/basket/list_basket_item';
import { PromiseFeedback } from 'app/contracts/users/promiseFeedback';
import { UserInfo } from 'app/contracts/users/userInfo';
import { Customer } from 'app/entities/customer';
import { UpdateUser } from 'app/entities/updateuser.model';
import { User } from 'app/entities/user';
import { BehaviorSubject, firstValueFrom, map, Observable, tap } from 'rxjs';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';
import { UpdateCurrentPassword, UpdatePassword } from './updatePassword';
import { List_User } from 'app/contracts/users/list_user';
import { Create_User } from 'app/contracts/users/create_user';
declare const require: any
@Injectable({
  providedIn: "root"
})
export class UserAuthService {
  constructor(private httpClientService: HttpClientService, private jwtHelper: JwtHelperService, private toastrService: CustomToastrService) { }
  user = new BehaviorSubject<User | null>(null);
  customer: Customer

  async login(UsernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { UsernameOrEmail, password }).pipe(
      tap(response => {
        this.handleUser(response.token.accessToken, response.token.expiration, response.token.refreshToken, response.token.email),
          this.handleCustomer(response.token.user.firstName, response.token.user.lastName, response.token.user.accessFailedCount, response.token.user.addresses, response.token.user.baskets, response.token.user.comments, response.token.user.email, response.token.user.emailConfirmed, response.token.user.id, response.token.user.phone, response.token.user.gender, response.token.user.birthday, response.token.user.favoriteProducts)
      })
    )
    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Kullanıcı girişi başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Info,
        position: ToastrPosition.BottomRight
      })
    }
    callBackFunction();
  }
  encrypt(any: string) {
    var CryptoTS = require("crypto-ts")
    var cipherText = CryptoTS.AES.encrypt(any, "ogfdo@.,12_");
    return cipherText.toString()
  }
  async decrypt(abc: string) {
    const CryptoTS = require("crypto-ts")
    const bytes = CryptoTS.AES.decrypt(abc, "ogfdo@.,12_");
    const plaintext = bytes.toString(CryptoTS.enc.Utf8);
    return plaintext
  }
  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);
    return await firstValueFrom(observable) as Create_User;
  }
  private async handleCustomer(firstName: string, lastName: string, accessFailedCount: number, addresses: string[], baskets: List_Basket_Item[], comments: string[], email: string, emailConfirmed: boolean, id: string, phone: string, gender: boolean, birthday: Date, favoriteProducts: string[]) {
    const customer = new Customer(firstName, lastName, accessFailedCount, addresses, baskets, comments, this.encrypt(email), emailConfirmed, id, phone, gender, birthday, favoriteProducts)
    localStorage.setItem("customer", JSON.stringify(customer))
  }
  private async handleUser(accessToken: string, expiration: string, refreshToken: string, email: string) {
    // const expirationDate = new Date().getTime() + (+expiration * 1000)
    const user = new User(accessToken, Date.parse(expiration), refreshToken, this.encrypt(email))
    this.user.next(user);
    localStorage.setItem("user", JSON.stringify(user))
    if (email === environment.adminEmail) {
      sessionStorage.setItem("iA", "true")
    }
  }
  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state) => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    }, { refreshToken: refreshToken });
    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }
      callBackFunction(tokenResponse ? true : false);
    } catch {
      callBackFunction(false);
    }
  }
  async getUserInfo(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<UserInfo> = this.httpClientService.get<UserInfo>({
      controller: "users",
    }, id);
    return await firstValueFrom(observable)
  }
  async update(user: UpdateUser): Promise<PromiseFeedback> {
    const observable: Observable<PromiseFeedback | UpdateUser> = this.httpClientService.put<UpdateUser>({
      controller: "users",
      action: "UserUpdate"
    }, user);

    return await firstValueFrom(observable) as PromiseFeedback;
  }
  async autoLogin() {
    if (localStorage.getItem("user") == null) {
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const loadedUser = new User(user.accessToken, user.expiration, user.refreshToken, user.userEmail)
    if (loadedUser.token) {
      this.user.next(loadedUser)
    }
  }
  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user).pipe(
      tap(response => {
        this.handleUser(response.token.accessToken, response.token.expiration, response.token.refreshToken, response.token.user.email),
          this.handleCustomer(response.token.user.firstName, response.token.user.lastName, response.token.user.accessFailedCount, response.token.user.addresses, response.token.user.baskets, response.token.user.comments, response.token.user.email, response.token.user.emailConfirmed, response.token.user.id, response.token.user.phone, response.token.user.gender, response.token.user.birthday, response.token.user.favoriteProducts)
      })
    )
    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.isAuth = true;
      this.isAuthenticateed()
      this.toastrService.message("Google üzerinden giriş başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Info,
        position: ToastrPosition.BottomRight
      });
    }
    callBackFunction();
  }

  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "facebook-login"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      this.isAuth = true;
      this.isAuthenticateed()
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Facebook üzerinden giriş başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    }
    callBackFunction();
  }
  async assignRoleToUser(id: string, roles: string[], successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-to-user"
    }, {
      userId: id,
      roles: roles
    });
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack())
      .catch(error => errorCallBack(error));
    await promiseData;
  }
  async getRolesToUser(userId: string, successCallBack?: () => void, errorCallBack?: (error) => void): Promise<string[]> {
    const observable: Observable<{ userRoles: string[] }> = this.httpClientService.get({
      controller: "users",
      action: "get-roles-to-user"
    }, userId);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack())
      .catch(error => errorCallBack(error));
    return (await promiseData).userRoles;
  }
  async getAllCustomers(page: number = 0, size: number = 5): Promise<{ totalUsersCount: number; users: List_User[] }> {
    const observable: Observable<{ totalUsersCount: number; users: List_User[] }> = this.httpClientService.get({
      controller: "users",
      action: "getAllCustomers",
      queryString: `page=${page}&size=${size}`
    });
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getAllUsers(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalUsersCount: number; users: List_User[] }> {
    const observable: Observable<{ totalUsersCount: number; users: List_User[] }> = this.httpClientService.get({
      controller: "users",
      queryString: `page=${page}&size=${size}`
    });
    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));
    return await promiseData;
  }
  async passwordReset(email: string, callBackFunction?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, { email: email });
    await firstValueFrom(observable);
    callBackFunction();
  }
  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "users"
    }, id);
    await firstValueFrom(deleteObservable);
  }
  async updatePassword(updtPassword: UpdatePassword, successCallBack?: () => void) {
    const observable: Observable<PromiseFeedback | any> = this.httpClientService.post<UpdatePassword>({
      action: "update-password",
      controller: "users"
    },
      updtPassword
    );
    const promiseData: Promise<PromiseFeedback> = firstValueFrom(observable);
    promiseData.then(value => successCallBack());
    await promiseData;
  }
  async updateCurrentPassword(updtPassword: UpdateCurrentPassword, successCallBack?: () => void) {
    const observable: Observable<PromiseFeedback | any> = this.httpClientService.post<UpdateCurrentPassword>({
      action: "UpdateCurrentPassword",
      controller: "users"
    },
      updtPassword
    );
    const promiseData: Promise<PromiseFeedback> = firstValueFrom(observable);
    promiseData.then(value => successCallBack());
    await promiseData;
  }
  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
  async sendConfirmEmail(userId: string): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "SendConfirmEmail"
    }, {
      userId: userId
    });
    return await firstValueFrom(observable);
  }
  async confirmEmail(userId: string, token: string): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "ConfirmEmail"
    }, {
      userId: userId,
      token: token
    });

    return await firstValueFrom(observable);
  }
  async identityCheck(): Promise<boolean> {
    const token: string = localStorage.getItem("accessToken");
    // const decodeToken = this.jwtHelper.decodeToken(token);
    const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);
    let expired: boolean;
    try {
      // expired = this.jwtHelper.isTokenExpired(token);
      expired = expirationDate > new Date();
    } catch {
      expired = false;
    }
    return _isAuthenticated = token != null && expired;
  }
  isAuth: boolean = false;
  
  logout() {
    this.isAuth = false;
    this.user.next(null)
    localStorage.clear()
    sessionStorage.clear()
  }
  async isAuthenticateed() {
    if (this.isAuth) {
      return true;
    }
    return false;
  }
}
export let _isAuthenticated: boolean;