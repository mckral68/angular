import { CustomToastrService, ToastrMessageType, ToastrPosition } from './../../../services/ui/custom-toastr.service';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  templateUrl: './verifyemail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private userAuthService: UserAuthService, private customToastr: CustomToastrService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(a =>
      this.userAuthService.confirmEmail(a.userId, a.token).then(v => (v['state']?.succeeded ? this.customToastr.message("Hesabınıza ait e-posta başarıyla onaylandı.", "E-Posta Onaylandı", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomFullWidth }) : this.customToastr.message("Hesabınıza ait e-posta onaylanamadı.", "E-Posta Onaylanamadı", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomFullWidth }))
      )
    )
    this.router.navigate(['/hesabim']);
  }
}
