import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Customer } from 'app/entities/customer';
import { UpdateUser } from 'app/entities/updateuser.model';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { MatRadioModule } from '@angular/material/radio';
import { UserInfo } from 'app/contracts/users/userInfo';
import { PromiseFeedback } from 'app/contracts/users/promiseFeedback';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

declare const require: any;
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  providers: [provideNgxMask()],
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  user: Customer;
  usersInfo: UserInfo;
  email: string;
  userInfo: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserAuthService,
    spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: CustomToastrService
  ) {
    super(spinner);
    this.getUserInfo();
  }
  async ngOnInit(): Promise<void> {
    // this.user = JSON.parse(localStorage.getItem("customer" || "[]")); this.decrypt(this.user.email)
    await this.userService
      .getUserInfo(JSON.parse(localStorage.getItem('customer'))['id'])
      .then((a) => (this.usersInfo = a));
    await this.setValue();
  }
  private async getUserInfo() {
    this.userInfo = this.fb.group({
      firstName: [
        this.usersInfo?.firstName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        this.usersInfo?.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      email: [
        this.usersInfo?.email,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(32),
          Validators.email,
        ],
      ],
      phone: [
        this.usersInfo?.phone,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      birthDay: this.fb.group({
        day: [this.usersInfo?.birthDay.getDate(), [Validators.required]],
        month: [this.usersInfo?.birthDay.getMonth(), [Validators.required]],
        year: [this.usersInfo?.birthDay.getFullYear(), [Validators.required]],
      }),
      gender: [this.usersInfo?.gender, [Validators.required]],
    });
  }
  private async setValue() {
    const birthday = new Date(this.usersInfo.birthDay);

    this.userInfo.setValue({
      firstName: this.usersInfo.firstName,
      lastName: this.usersInfo.lastName,
      email: this.usersInfo.email,
      phone: this.usersInfo.phone,
      gender: this.usersInfo.gender,
      birthDay: {
        day: birthday.getDate(),
        month: birthday.getMonth() + 1,
        year: birthday.getFullYear(),
      },
    });
  }
  get f() {
    return this.userInfo.controls;
  }
  private async decrypt(email: string) {
    const CryptoTS = require('crypto-ts');
    const bytes = CryptoTS.AES.decrypt(email, 'ogfdo@.,12_');
    const plaintext = bytes.toString(CryptoTS.enc.Utf8);
    this.email = plaintext;
  }
  pc(event: any) {
    this.userInfo.controls['phone'].setValue('05');
  }
  submitted: boolean = false;
  async update(user: UpdateUser) {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    user.userId = JSON.parse(localStorage.getItem('customer'))['id'];
    this.submitted = true;
    if (this.userInfo.invalid) return;
    const result: PromiseFeedback = await this.userService.update(user);
    if (result.succeeded) {
      this.toastrService.message(result.message, 'Kullanıcı Kaydı Başarılı', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    } else
      this.toastrService.message(result.message, 'Hata Oluştu', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    this.router.navigate(['/hesabim']);
    this.hideSpinner(SpinnerType.LineScalePulseOut);
  }
}
