import { BaseComponent, SpinnerType } from './../../../base/base.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Create_User } from '../../../contracts/users/create_user';
import { User } from '../../../entities/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'], standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    GoogleSigninButtonModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, spinner: NgxSpinnerService, private userService: UserAuthService, private toastrService: CustomToastrService, private socialAuthService: SocialAuthService) {
    super(spinner)

  }
  frm: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      'firstName': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'lastName': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      'email': [null, [Validators.required, Validators.minLength(10), Validators.maxLength(32), Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-z\d$@$!%*?&].{8,30}')]],
      'passwordConfirm': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-z\d$@$!%*?&].{8,30}')]],
    })
  }

  get component() {
    return this.frm.controls;
  }
  registerForm: FormGroup
  async onSubmit(user: User) {
    this.submitted = true;
    if (this.frm.invalid && this.registerForm.controls['password'].value !== this.registerForm.controls['passwordConfirm'].value) {
      return
    } else {
      const result: Create_User = await this.userService.create(user);
      if (result.succeeded) {
        this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        })
        this.router.navigate(['/giris']);
      }
      else
        this.toastrService.message(result.message, "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        })
    }
  }
  submitted: boolean = false;
  async register(user: User) {
    this.submitted = true;
    if (this.registerForm.invalid && this.registerForm.get('password').value !==
      this.registerForm.get('passwordConfirm').value) {
      return;
    }
    else {
      this.showSpinner(SpinnerType.LineScalePulseOut)
      const result: Create_User = await this.userService.create(user);
      if (result.succeeded) {
        this.router.navigate(['/giris'])
        this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        })
      }
      else
        this.toastrService.message(result.message, "Hata Alındı", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        })
      this.hideSpinner(SpinnerType.LineScalePulseOut)
    }
    this.registerForm.reset()
    }
  show: boolean = false;
  reshow: boolean = false;
  async showPass(a: string) {
    a == "pass" ? this.show = !this.show : this.reshow = !this.reshow;
  }
  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  googleLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
