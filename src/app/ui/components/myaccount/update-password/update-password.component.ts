import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../../../services/admin/alertify.service';
import { UserAuthService } from '../../../../services/common/models/user-auth.service';
import { UpdatePassword } from 'app/services/common/models/updatePassword';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private userAuthService: UserAuthService,
    private activatedRoute: ActivatedRoute,
    private alertifyService: AlertifyService,
    private router: Router
  ) {
    super(spinner);
  }
  updtPassword: UpdatePassword;
  state: any;
  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.BallAtom);
    this.activatedRoute.params.subscribe({
      next: async (params) => {
        this.updtPassword.userId = params['userId'];
        this.updtPassword.resetToken = params['resetToken'];
        this.state = await this.userAuthService.verifyResetToken(
          this.updtPassword.resetToken,
          this.updtPassword.userId,
          () => {
            this.hideSpinner(SpinnerType.BallAtom);
          }
        );
      },
    });
  }

  updatePassword(password: string, passwordConfirm: string) {
    this.showSpinner(SpinnerType.BallAtom);
    if (password != passwordConfirm) {
      this.alertifyService.message('Şifreleri doğrulayınız!', {
        messageType: MessageType.Error,
        position: Position.TopRight,
      });
      this.hideSpinner(SpinnerType.BallAtom);
      return;
    }
    this.activatedRoute.params.subscribe({
      next: async (params) => {
        this.updtPassword.userId = params['userId'];
        this.updtPassword.resetToken = params['resetToken'];
        await this.userAuthService.updatePassword(this.updtPassword, () => {
          this.alertifyService.message('Şifre başarıyla güncellenmiştir.', {
            messageType: MessageType.Success,
            position: Position.TopRight,
          });
          this.router.navigate(['/login']);
        });
        this.hideSpinner(SpinnerType.BallAtom);
      },
    });
  }
}
