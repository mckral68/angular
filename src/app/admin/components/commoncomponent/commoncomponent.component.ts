import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Attribute, AttributeValue } from 'app/contracts/variable_option.model';
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { Modal } from 'bootstrap';
@Component({
  selector: 'commoncomponent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DeleteDirectiveModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './commoncomponent.component.html',
  styleUrl: './commoncomponent.component.scss',
})
export class CommoncomponentComponent implements OnInit {
  @Input() items: Attribute[] | AttributeValue[] = [];
  @Input() modalTitle: string = '';
  @Input() isSelected: boolean = false;
  @Input() idList: number[] = [];
  @Input() formFields: any[] = [];
  @Input() value: string = '';
  @Input() id: string = '';
  @Input() controller: string = '';
  @Input() options: Partial<Options>;
  @Output() itemAdded = new EventEmitter<Attribute | AttributeValue>();
  @Output() itemUpdated = new EventEmitter<ItemType>();
  @Output() statusChanged = new EventEmitter<Attribute | AttributeValue>();
  editMode: boolean = false;
  form: FormGroup;
  item: ItemType = {
    id: '',
    name: '',
    value: '',
    state: true,
  };
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }
  ngOnInit(): void {
    this.formFields.forEach((field) => {
      this.form.addControl(
        field?.name,
        this.fb.control(
          field.value || '',
          field.required && Validators.required
        )
      );
    });
  }
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
    console.log(v);
    if (v.length < 1) {
      return;
    } else {
      this.itemAdded.emit(v);
    }
  }
  async updateValue(v: ItemType) {
    if (v.name?.length < 1 || v.value?.length < 1) {
      return;
    } else {
      this.itemUpdated.emit(v);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      // Burada form verilerini işleyebilirsiniz
    }
  }
  changeMode(m: boolean, value?: string, id?: string) {
    this.editMode = m;
    this.editMode
      ? ((this.item.id = id), (this.item.name = value))
      : (this.value = '');
    const modal = new Modal(document.getElementById('template-modal'));
    modal.show();
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
export class Options {
  controller?: string;
  action?: string;
}
export class ItemType {
  id: string;
  name: string;
  value?: string;
  state?: boolean;
}
