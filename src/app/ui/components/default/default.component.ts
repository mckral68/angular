import { NavbarComponent } from './../shared/navbar/navbar.component';
import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClientService } from 'app/services/common/http-client.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  providers: [HttpClientService],
})
export class DefaultComponent {}
