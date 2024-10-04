import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../services/ui/custom-toastr.service';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UpdateCurrentPassword } from 'app/services/common/models/updatePassword';

@Component({
  selector: 'update-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private router: Router, private formBuilder: FormBuilder, private userAuthService: UserAuthService, private customToastr: CustomToastrService) {
    super(spinner);
  }
  async ngOnInit(): Promise<void> {
    this.updatePass = this.formBuilder.group({
      'currentPassword': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-z\d$@$!%*?&].{8,30}')]],
      'password': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-z\d$@$!%*?&].{8,30}')]],
      'passwordConfirm': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@,!%*?&])[A-Za-z\d$@$!%*?&].{8,30}')]],
    })
  }
  updatePass: FormGroup
  crpas: boolean = false;
  show: boolean = false;
  shw: boolean = false;
  async showPass(val: string) {
    switch (val) {
      case val = 'pass':
        this.show = !this.show
        break;
      case val = 'crpass':
        this.crpas = !this.crpas
        break;
      default:
        this.shw = !this.shw
        break;
    }
  }
  async updatePassword() {
    if (this.updatePass.valid) {
      this.showSpinner(SpinnerType.BallAtom)
      const user = new UpdateCurrentPassword()
      user.currentPassword = this.updatePass.value.currentPassword;
      await this.userAuthService.decrypt(JSON.parse(localStorage.getItem("user"))?.userEmail).then(a => user.email = a)
      user.password = this.updatePass.value.password;
      user.passwordConfirm = this.updatePass.value.passwordConfirm
      this.userAuthService.updateCurrentPassword(user, () => {
        this.customToastr.message("Şifreniz başarıyla güncellenmiştir.", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomFullWidth,
        });
        this.router.navigate(['/hesabim']);
        this.hideSpinner(SpinnerType.BallAtom)
      })
      this.updatePass.reset()
    } else {
      return
    }
  }
  formkontrol(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { formControl: true }
    }
    return null
  }
}
