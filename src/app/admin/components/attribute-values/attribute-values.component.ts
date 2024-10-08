import { CommonModule } from '@angular/common';
import { Component, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from 'app/admin/utils/breadcrumb/breadcrumb.component';
import { AttributeValue } from 'app/contracts/variable_option.model';
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { ProductService } from 'app/services/common/models/product.service';
import {
  CommoncomponentComponent,
  Itemoptions,
} from '../commoncomponent/commoncomponent.component';
import { DataService } from 'app/services/admin/data.service';

@Component({
  selector: 'app-attribute-values',
  standalone: true,
  imports: [
    CommonModule,
    CommoncomponentComponent,
    RouterModule,
    FormsModule,
    DeleteDirective,
    BreadcrumbComponent,
  ],
  templateUrl: './attribute-values.component.html',
  styleUrl: './attribute-values.component.scss',
})
export class AttributeValuesComponent {
  private productService = inject(ProductService);
  private dataService = inject(DataService);
  private activatedRouted = inject(ActivatedRoute);
  values: AttributeValue[];
  value: string = '';
  id: string;
  editMode: boolean = false;
  isSelected: boolean = false;
  idList: number[] = [];
  allSelected: boolean = false;
  @Output() itemoptions: Partial<Itemoptions> = {
    addAction: 'CreateAttributeValue',
    updAction: 'UpdateAttributeValue',
    removeAction: 'RemoveAttribute',
    controller: 'variation',
    updateStatus: 'UpdateAttributeValues',
    objectName: 'attributeValue',
  };
  formFields: object[] = [];
  async ngOnInit(): Promise<void> {
    await this.getValuesByAttId();
    this.activatedRouted.params.subscribe((params) => {
      const attributeId = params['id'];
      this.initializeFormFields(attributeId);
      this.dataService.updateFormFields(this.formFields);
    });
  }
  private initializeFormFields(attributeId: string) {
    this.formFields = [
      {
        type: 'hidden',
        name: 'id',
        value: '',
        label: 'id',
        required: false,
      },
      {
        type: 'hidden',
        name: 'attributeId',
        value: attributeId,
        required: false,
      },
      {
        type: 'text',
        name: 'value',
        value: '',
        label: 'Değeri',
        required: true,
      },
      {
        type: 'checkbox',
        name: 'status',
        value: '',
        label: 'Aktif mi',
        required: false,
      },
    ];
  }
  async getValuesByAttId() {
    await this.productService
      .getValuesByAttributeId(this.activatedRouted.snapshot.params.id)
      .then((c) => (this.values = c.values));
  }
  breadcrumbItems = [
    { label: 'Ürün Özellikleri', link: '/admin/attribute' },
    { label: 'Renk' },
  ];
  handleItemSelected(item: AttributeValue) {
    console.log(item); // Child bileşeninden gelen öğeyi işleyin.
  }
  activeState() {
    this.productService
      .updateAttributeValues(this.idList)
      .then(async () => await this.getValuesByAttId());
  }
  changeMode(m: boolean, value?: string, id?: string) {
    this.editMode = m;
    this.editMode ? ((this.value = value), (this.id = id)) : (this.value = '');
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
  checkAll() {
    this.isSelected = !this.isSelected;
    this.isSelected
      ? this.values.forEach(
          (a) => (this.idList = [...new Set(this.idList), +a.id])
        )
      : (this.idList = []);
    this.idList = [...new Set(this.idList)];
  }
  async addValue(value: string) {
    if (value.length < 1) {
      return;
    } else {
      await this.productService
        .createAttributeValue(this.activatedRouted.snapshot.params.id, value)
        .then(async (r) => {
          if (r.succeeded) {
            await this.getValuesByAttId().then(() => (this.value = ''));
          }
        });
    }
  }
  async updateAttributeValue(a: AttributeValue) {
    if (this.editMode) {
      a.value = this.value;
    }
    a.id = this.id;
    await this.productService.updateAttValue(a).then(async (r) => {
      if (r.succeeded) {
        await this.getValuesByAttId().then(() => (this.value = ''));
      }
    });
    this.editMode = false;
  }
  async changeStatus(a: AttributeValue) {
    a.status = !a.status;
    await this.updateAttributeValue(a);
  }
}
