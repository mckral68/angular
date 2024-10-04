import { CommonModule } from '@angular/common';
import { ViewEncapsulation, inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
  ],
})
export class LoginComponent extends BaseComponent implements OnInit {
  private userAuthService = inject(UserAuthService);
  constructor(
    private formBuilder: FormBuilder,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
    this.registerForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(32),
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-zd$@$!%*?&].{8,30}'
          ),
        ],
      ],
    });
    this.resetForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(32),
          Validators.email,
        ],
      ],
    });
  }
  loading: boolean = false;
  registerForm: FormGroup;
  resetForm: FormGroup;
  loggedIn!: boolean;
  user: SocialUser;
  error: string = '';
  async ngOnInit(): Promise<void> {
    this.socialLogin();
  }
  getControl(name: any): AbstractControl | null {
    return this.registerForm.get(name);
  }
  async login() {
    this.showSpinner(SpinnerType.LineScalePulseOut)
    this.loading = true;
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      await this.userAuthService
        .login(email, password, async () => {
          await this.userAuthService.identityCheck();
          this.activatedRoute.queryParams.subscribe((params) => {
            const returnUrl: string = params['returnUrl'];
            if (returnUrl) this.router.navigateByUrl(returnUrl);
            else this.router.navigate(['/']);
          });
        }).then(() => this.hideSpinner(SpinnerType.LineScalePulseOut));
    }
    this.loading = false;
  }
  async facebookLogin() {
    await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  async googleLogin() {
    await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  async signOut(): Promise<void> {
    await this.socialAuthService.signOut();
  }
  show: boolean = false;
  async showPass() {
    this.show = !this.show;
  }
  async passwordReset() {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    await this.userAuthService
      .passwordReset(this.resetForm.value.email, () => {
        this.resetForm.reset();
        this.toastrService.message(
          'Sıfırlama e-postası başarıyla gönderilmiştir.',
          'E-posta gönderildi',
          {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopFullWidth,
          }
        );
      })
      .then(() => this.hideSpinner(SpinnerType.LineScalePulseOut));
  }
  socialLogin() {
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.user = user;
      this.loggedIn = user != null;
      if (user) {
        switch (user.provider) {
          case 'GOOGLE':
            await this.userAuthService.googleLogin(user, async () => {
              await this.userAuthService.identityCheck();
              this.activatedRoute.queryParams.subscribe((params) => {
                const returnUrl: string = params['returnUrl'];
                if (returnUrl) this.router.navigate([returnUrl]);
                else this.router.navigate(['/']);
              });
            });
            break;
          case 'FACEBOOK':
            await this.userAuthService.facebookLogin(user, async () => {
              await this.userAuthService.identityCheck();
            });
            break;
        }
      }
    });
  }
}
