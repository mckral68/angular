import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { List_User } from '../../../contracts/users/list_user';
import { AuthorizeUserDialogComponent } from '../../../dialogs/authorize-user-dialog/authorize-user-dialog.component';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { DialogService } from '../../../services/common/dialog.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'], standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, MatPaginatorModule, MatTableModule, MatButtonModule, DeleteDirectiveModule, MatDialogModule],
  providers: [DialogService]
})
export class ListComponent extends BaseComponent implements OnInit {


  constructor(spinner: NgxSpinnerService,
    private userService: UserAuthService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService) {
    super(spinner)
  }


  displayedColumns: string[] = ['nameSurname','phone', 'email', 'twoFactorEnabled', 'role', 'delete'];
  dataSource: MatTableDataSource<List_User> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getUsers() {
    this.showSpinner(SpinnerType.BallAtom);
    const allUsers: { totalUsersCount: number; users: List_User[] } = await this.userService.getAllUsers(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5, () => this.hideSpinner(SpinnerType.BallAtom), errorMessage => this.alertifyService.message(errorMessage, {
      dismissOthers: true,
      messageType: MessageType.Error,
      position: Position.TopRight
    }))
    this.dataSource = new MatTableDataSource<List_User>(allUsers.users);
    this.paginator.length = allUsers.totalUsersCount;
  }

  async pageChanged() {
    await this.getUsers();
  }

  async ngOnInit() {
    await this.getUsers();
  }

  assignRole(id: string) {
    this.dialogService.openDialog({
      componentType: AuthorizeUserDialogComponent,
      data: id,
      options: {
        width: "750px"
      },
      afterClosed: () => {
        this.alertifyService.message("Roller başarıyla atanmıştır!", {
          messageType: MessageType.Success,
          position: Position.TopRight
        })
      }
    });
  }
}
