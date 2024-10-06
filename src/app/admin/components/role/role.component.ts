import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DialogService } from 'app/services/common/dialog.service';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from 'app/services/common/models/role.service';
import { MessageType, Position } from 'app/services/admin/alertify.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { List_Role } from 'app/contracts/role/List_Role';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertifyService } from '../../../services/admin/alertify.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatTableModule,
    DeleteDirective,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  providers: [DialogService],
})
export class RoleComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Role> = null;
  isEditRole: boolean = false;
  id: string;
  txtName: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    spiner: NgxSpinnerService,
    private roleService: RoleService,
    private alertifyService: AlertifyService
  ) {
    super(spiner);
  }
  async ngOnInit(): Promise<void> {
    await this.getRoles();
  }
  async pageChanged() {
    await this.getRoles();
  }
  async create(name: HTMLInputElement) {
    if (name.value.length > 4) {
      this.showSpinner(SpinnerType.BallAtom);
      await this.roleService
        .create(
          name.value,
          () => {
            this.alertifyService.message('Rol başarıyla eklenmiştir.', {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight,
            });
          },
          (errorMessage) => {
            this.alertifyService.message(errorMessage, {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight,
            });
          }
        )
        .then(async () => await this.getRoles())
        .then(() => this.hideSpinner(SpinnerType.BallAtom));
    } else {
      this.alertifyService.message('Rol en az 5 karakter olmalıdır.', {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight,
      });
    }
    name.value = '';
  }
  async getRoles() {
    this.showSpinner(SpinnerType.BallAtom);
    const allRoles: { datas: List_Role[]; totalCount: number } =
      await this.roleService.getRoles(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => this.hideSpinner(SpinnerType.BallAtom),
        (errorMessage) =>
          this.alertifyService.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
          })
      );
    this.dataSource = new MatTableDataSource<List_Role>(allRoles.datas);
    this.paginator.length = allRoles.totalCount;
  }
  editClick(id: string, name: string) {
    this.isEditRole = true;
    this.txtName = name;
    this.id = id;
  }
  async editRole(name: HTMLInputElement) {
    this.txtName = '';
    this.isEditRole = false;
    await this.roleService
      .updateRole(this.id, name.value)
      .then(async () => await this.getRoles());
  }
}
