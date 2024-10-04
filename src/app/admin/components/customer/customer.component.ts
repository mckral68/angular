import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'app/base/base.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class CustomerComponent extends BaseComponent implements OnInit {
  private userService = inject(UserAuthService);
  users=[]
  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }

  async ngOnInit(): Promise<void> {
    await this.userService
      .getAllCustomers(0, 5)
      .then((a) => this.users=a.users);
  }
}
