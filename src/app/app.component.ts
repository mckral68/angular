import { HttpClientService } from './services/common/http-client.service';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from './services/common/models/user-auth.service';
import { BaseComponent } from './base/base.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [HttpClientService],
  imports: [RouterModule, NgxSpinnerModule],
})
export class AppComponent extends BaseComponent implements OnInit {
  private userAuthService = inject(UserAuthService);

  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }
  async ngOnInit(): Promise<void> {
    await this.userAuthService.autoLogin();
  }
}
