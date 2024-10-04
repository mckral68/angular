import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogService } from 'app/services/common/dialog.service';
import { ProductService } from 'app/services/common/models/product.service';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { AttributeValue, Attribute } from 'app/contracts/variable_option.model';
@Component({
  selector: 'app-product-variation',
  templateUrl: './product-variation.component.html',
  styleUrls: ['./product-variation.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    DeleteDirectiveModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [DialogService],
})
export class ProductVariationComponent implements OnInit {
  private productService = inject(ProductService);
  private dialogService = inject(DialogService);
  attributes: Attribute[] = [];
  values: AttributeValue[] = [];
  att: Attribute;
  productForm: FormGroup;
  value: string = '';
  id: string;
  editMode: boolean = false;
  optionId: string;
  idList: number[] = [];
  isSelected: boolean = false;
  allSelected: boolean = false;
  async ngOnInit() {
    await this.getAllAttributes();
  }

  async getAllAttributes() {
    await this.productService
      .getAllAttributes()
      .then((c) => (this.attributes = c.attributes));
  }
  async changeStatus(a: Attribute) {
    a.status = !a.status;
    await this.updateAttribute(a);
  }
  async createAttribue(value: string) {
    if (value.length > 3) {
      await this.productService
        .createAttribute(value.trim())
        .then(
          async () =>
            (this.attributes = await this.productService
              .getAllAttributes()
              .then((b) => (this.attributes = b.attributes)))
        );
      this.productForm.reset();
    } else {
      return;
    }
  }
  async createValue(value: string) {
    await this.productService
      .createAttributeValue(this.att.id, value.trim())
      .then(
        async () =>
          (this.values = await this.productService
            .getAllAttributeValues()
            .then((b) => (this.values = b.values)))
      );
    this.productForm.reset();
  }
  async addValue(attribute: Attribute) {
    if (attribute.name.length < 1) {
      return;
    } else {
      this.editMode == false
        ? await this.createAttribute(this.value)
        : await this.updateAttribute(attribute);
    }
  }
  async createAttribute(v: string) {
    await this.productService.createAttribute(v).then(async (r) => {
      if (r.succeeded) {
        await this.getAllAttributes().then(() => (this.value = ''));
      }
    });
  }
  async updateAttribute(att: Attribute) {
    this.productService.updateAttribute(att).then(async (r) => {
      if (r.succeeded) {
        await this.getAllAttributes().then(() => (this.value = ''));
      }
    });
  }
  activeState() {
    this.productService
      .updateAttributeList(this.idList)
      .then(async () => await this.getAllAttributes());
  }
  checkAll() {
    this.isSelected = !this.isSelected;
    this.attributes.forEach(
      (a) => (this.idList = [...new Set(this.idList), +a.id])
    );
    this.idList = [...new Set(this.idList)];
    console.log(this.idList);
  }
  checkList(id: number, checked: boolean) {
    if (checked) {
      this.idList = [...new Set(this.idList), id];
      this.idList = [...new Set(this.idList)];
    } else {
      this.idList.splice(
        this.idList.findIndex((a) => a == id),
        1
      );
    }
    console.log(this.idList);
  }
  deleteList(id: number) {}
  changeMode(m: boolean, value?: string, id?: string) {
    this.editMode = m;
    this.editMode ? ((this.value = value), (this.id = id)) : (this.value = '');
  }
}
