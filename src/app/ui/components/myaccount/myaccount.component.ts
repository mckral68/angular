import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from './../../../base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Customer } from 'app/entities/customer';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, 
],
})
export class MyaccountComponent extends BaseComponent implements OnInit {
  user: Customer;
  isAdmin: boolean = false;
  loggedIn: boolean = false;
  private userService = inject(UserAuthService);
  private socialAuthService = inject(SocialAuthService);
  private toastrService = inject(CustomToastrService);
  private router = inject(Router);
  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }
  async ngOnInit(): Promise<void> {
    this.user = JSON.parse(localStorage.getItem('customer' || '[]'));
    this.user
      ? this.userService
          .decrypt(this.user.email)
          .then((cl) => (this.user.email = cl))
      : null;
    JSON.parse(sessionStorage.getItem('iA'))
      ? (this.isAdmin = true)
      : (this.isAdmin = false);
  }
  async signOut(): Promise<void> {
    this.userService.logout();
    await this.userService.identityCheck();
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialAuthService.signOut();
      }
    });
    this.router.navigate(['']);
  }
  async confirmEmail() {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    await this.userService
      .sendConfirmEmail(this.user.id)
      .then((a) =>
        this.toastrService.message(a['state'], 'Başarılı', {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight,
        })
      );
    this.hideSpinner(SpinnerType.LineScalePulseOut);
  }
  async verifyConfirmEmail() {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    await this.userService
      .sendConfirmEmail(this.user.id)
      .then((a) =>
        this.toastrService.message(a['state'], 'Başarılı', {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight,
        })
      );
    this.hideSpinner(SpinnerType.LineScalePulseOut);
  }
}
