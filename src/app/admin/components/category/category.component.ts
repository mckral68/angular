import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTable, MatTableModule } from '@angular/material/table';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { DialogService } from 'app/services/common/dialog.service';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DeleteDirectiveModule,
  ],
  providers: [DialogService],
})
export class CategoryComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private categoryService: CategoryService
  ) {
    super(spinner);
  }

  categories: Category[] = [];
  dataSource = [];
  async ngOnInit() {
    await this.getAllCat();
  }

  displayedColumns: string[] = [
    'adı',
    'oluşturulduğu tarih',
    'En Son Güncelleme',
    'process',
  ];
  @ViewChild(MatTable) table: MatTable<Category>;
  async updateData() {
    this.table.renderRows();
    await this.categoryService.getAllCategories();
  }
  async getAllCat() {
    this.showSpinner(SpinnerType.BallAtom);
    await this.categoryService
      .getAllCategories()
      .then((res) => (this.dataSource = res.categories));
    this.hideSpinner(SpinnerType.BallAtom);
  }
  catValue: string;
  catId: string;
  updMode: boolean = false;
  async upd(name: string, id: string) {
    this.updMode = true;
    this.catValue = name;
    this.catId = id;
  }
  async upCat(name: string) {
    this.showSpinner(SpinnerType.BallAtom);
    this.catValue = '';
    this.updMode = false;
    await this.categoryService
      .update(this.catId, name)
      .then((r) => this.getAllCat());
    this.hideSpinner(SpinnerType.BallAtom);
  }
  async create(name: HTMLInputElement) {
    if (name.value.length > 3) {
      this.showSpinner(SpinnerType.BallAtom);
      let category: Category = { name: name.value, url: name.value };
      console.log(category);

      await this.categoryService.create(category).then(async () => {
        await this.getAllCat();
        this.catValue = '';
        this.hideSpinner(SpinnerType.BallAtom);
      });
    } else {
      return;
    }
  }
}
