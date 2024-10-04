import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { AuthorizeMenuDialogComponent } from 'app/dialogs/authorize-menu-dialog/authorize-menu-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '../../../base/base.component';
import { ApplicationService } from '../../../services/common/models/application.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from 'app/services/common/dialog.service';

interface ITreeMenu {
  name?: string,
  actions?: ITreeMenu[],
  code?: string,
  menuName?: string
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrls: ['./authorize-menu.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule,
    MatTreeModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule
  ], providers: [DialogService]

})
export class AuthorizeMenuComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private applicationService: ApplicationService, private dialogService: DialogService) {
    super(spinner)
  }

  async ngOnInit() {
    this.dataSource.data = (await this.applicationService.getAuthorizeDefinitionEndpoints())
      .map(m => {
        const treeMenu: ITreeMenu = {
          name: m.name,
          actions: m.actions.map(a => {
            const _treeMenu: ITreeMenu = {
              name: a.definition,
              code: a.code,
              menuName: m.name
            }
            return _treeMenu;
          })
        };
        return treeMenu;
      });
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (menu: ITreeMenu, level: number) => {
      return {
        expandable: menu.actions?.length > 0,
        name: menu.name,
        level: level,
        code: menu.code,
        menuName: menu.menuName
      };
    },
    menu => menu.level,
    menu => menu.expandable,
    menu => menu.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignRole(code: string, name: string, menuName: string) {
    this.dialogService.openDialog({
      componentType: AuthorizeMenuDialogComponent,
      data: { code: code, name: name, menuName: menuName },
      options: {
        width: "750px"
      },
      afterClosed: () => {
      }
    });
  }
}
