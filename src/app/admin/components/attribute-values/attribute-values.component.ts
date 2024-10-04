import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AttributeValue } from 'app/contracts/variable_option.model';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { ProductService } from 'app/services/common/models/product.service';

@Component({
  selector: 'app-attribute-values',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DeleteDirectiveModule],
  templateUrl: './attribute-values.component.html',
  styleUrl: './attribute-values.component.scss',
})
export class AttributeValuesComponent {
  private productService = inject(ProductService);
  private activatedRouted = inject(ActivatedRoute);
  values: AttributeValue[];
  value: string = '';
  id: string;
  editMode: boolean = false;
  isSelected: boolean = false;
  idList: number[] = [];
  allSelected: boolean = false;
  async ngOnInit(): Promise<void> {
    await this.getValuesByAttId();
  }
  async getValuesByAttId() {
    await this.productService
      .getValuesByAttributeId(this.activatedRouted.snapshot.params.id)
      .then((c) => (this.values = c.values));
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
   this.isSelected ?
    this.values.forEach(
      (a) => (this.idList = [...new Set(this.idList), +a.id])
    ):this.idList=[]
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
