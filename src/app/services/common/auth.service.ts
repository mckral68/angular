import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'app/entities/user';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from './models/auth.model';

@Injectable()
export class AuthService {
  isAuth: boolean = false;
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private route: ActivatedRoute, private jwtHelper: JwtHelperService) { }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     const userId = params['userId'];
  //     const token = params['token'];
  //     this.authService
  //       .confirmEmail(userId, token)
  //       .subscribe((data) => console.log(data));
  //   });
  register(email: string, password: string, rePassword: string) {
    return this.http
      .post<AuthResponse>(environment.url + 'kayit', {
        email: email,
        password: password,
        rePassword: rePassword,
      })
  }
  login(email: string, password: string) {
    this.isAuth = true;
    return this.http.post<AuthResponse>(environment.url + 'giris', {
      email: email,
      password: password,
    });
  }
  confirmEmail = (model: any) => {
    return this.http.post(environment.url + 'confirmemail', model);
  };
  isAuthenticateed() {
    if (this.isAuth) {
      return true;
    }
    return false;
  }
  logout() {
    this.isAuth = false;
    this.user.next(null)
    localStorage.removeItem("user")
    localStorage.removeItem("refreshToken")
  }
  private handleUser(accessToken: string, expiration: number, refreshToken: string) {
    const expirationDate = new Date(new Date().getTime() + (+expiration * 1000))
    const user = new User(accessToken, expiration, refreshToken)
    this.user.next(user);
    localStorage.setItem("user", JSON.stringify(user))
  }
  identityCheck() {
    const token: string = localStorage.getItem("accessToken");
    //const decodeToken = this.jwtHelper.decodeToken(token);
    //const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);
    let expired: boolean;
    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }
    _isAuthenticated = token != null && !expired;
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;