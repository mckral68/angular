import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MessageType, Position } from '../../../services/admin/alertify.service';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdatePassword } from 'app/services/common/models/updatePassword';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: true, imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class PasswordResetComponent implements OnInit {
  private activaedRoute=inject(ActivatedRoute);
  private router=inject(Router);
  private formBuilder=inject(FormBuilder);
  private userAuthService=inject(UserAuthService);
  private alertifyService=inject(CustomToastrService);
  updatePass: FormGroup
  id: string
  token: string
  ngOnInit(): void {
    this.activaedRoute.params.subscribe((params) => {
      this.token = params["Token"];
      this.id = params["userId"];
    })
    this.updatePass = this.formBuilder.group({
      'password': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      'passwordConfirm': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
    })
  }
  show: boolean = false;
  shw: boolean = false;
  async showPass(val: string) {
    val == "pass" ? this.show = !this.show : this.shw = !this.shw;
  }
  async updatePassword() {
    const user = new UpdatePassword()
    user.password = this.updatePass.value.password;
    user.passwordConfirm = this.updatePass.value.passwordConfirm
    user.userId = this.id
    user.resetToken = this.token;
    this.userAuthService.updatePassword(user, () => {
      this.alertifyService.message("Şifreniz başarıyla güncellenmiştir.","Başarılı",{
        messageType:ToastrMessageType.Info,
        position:ToastrPosition.TopFullWidth
      })
    }).then(() => this.router.navigateByUrl('/'))
    this.updatePass.reset()
  }
}
