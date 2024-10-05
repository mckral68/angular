import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogService } from 'app/services/common/dialog.service';
import { ProductService } from 'app/services/common/models/product.service';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { AttributeValue, Attribute } from 'app/contracts/variable_option.model';
import {
  CommoncomponentComponent,
  ItemType,
  Options,
} from '../commoncomponent/commoncomponent.component';
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
    CommoncomponentComponent,
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
  idList: number[] = [];
  formFields: object[] = [
    {
      type: 'hidden',
      name: 'id',
      value: '',
      label: 'id',
      required: false,
    },
    { type: 'text', name: 'name', value: '', label: 'Adı', required: true },
    {
      type: 'checkbox',
      name: 'state',
      value: '',
      label: 'Aktif mi',
      required: false,
    },
  ];
  isSelected: boolean = false;
  @Output() options: Partial<Options> = {
    action: 'RemoveAttribute',
    controller: 'variation',
  };
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

  async addValue(attribute: Attribute | any) {
    if (attribute.length < 1) {
      return;
    } else {
      await this.createAttribute(attribute);
    }
  }
  async createAttribute(v: string) {
    await this.productService.createAttribute(v).then(async (r) => {
      if (r.succeeded) {
        await this.getAllAttributes().then(() => (this.value = ''));
      }
    });
  }
  async updateAttribute(at: ItemType) {
    this.att = { id: at.id, name: at.name, status: at.state };
    this.productService.updateAttribute(this.att).then(async (r) => {
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
    this.isSelected
      ? this.attributes.forEach(
          (a) => (this.idList = [...new Set(this.idList), +a.id])
        )
      : (this.idList = []);
    this.idList = [...new Set(this.idList)];
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
  }
  changeMode(m: boolean, value?: string, id?: string) {
    this.editMode = m;
    this.editMode ? ((this.value = value), (this.id = id)) : (this.value = '');
  }
}
