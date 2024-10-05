import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Attribute, AttributeValue } from 'app/contracts/variable_option.model';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';

@Component({
  selector: 'commoncomponent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DeleteDirectiveModule],
  templateUrl: './commoncomponent.component.html',
  styleUrl: './commoncomponent.component.scss',
})
export class CommoncomponentComponent {
  @Input() items: Attribute[] | AttributeValue[] = [];
  @Input() modalTitle: string = '';
  @Input() editMode: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() idList: number[] = [];
  @Input() value: string = '';
  @Input() id: string = '';
  @Output() itemAdded = new EventEmitter<Attribute | AttributeValue>();
  @Output() itemUpdated = new EventEmitter<Attribute | AttributeValue>();
  @Output() statusChanged = new EventEmitter<Attribute | AttributeValue>();
  checkAll() {
    this.isSelected = !this.isSelected;
    this.isSelected
      ? this.items.forEach(
          (a) => (this.idList = [...new Set(this.idList), +a.id])
        )
      : (this.idList = []);
    this.idList = [...new Set(this.idList)];
  }
  checkList(id: string, checked: boolean) {
    if (checked) {
      this.idList = [...new Set(this.idList), +id];
      this.idList = [...new Set(this.idList)];
    } else {
      this.idList.splice(
        this.idList.findIndex((a) => a == +id),
        1
      );
    }
  }
  async addValue(v: any) {
    if (v.name.length < 1) {
      return;
    } else {
      this.editMode == false
        ? await this.itemAdded.emit(v?.value)
        : await this.itemUpdated.emit(v);
    }
  }
  changeMode(m: boolean, value?: string, id?: string) {
    this.editMode = m;
    this.editMode ? ((this.value = value), (this.id = id)) : (this.value = '');
  }
  changeStatus(a: Attribute) {
    a.status = !a.status;
    this.itemUpdated.emit(a);
  }
  activeState() {
    // this.productService
    //   .updateAttributeList(this.idList)
    //   .then(async () => await this.getAllAttributes());
  }
}
