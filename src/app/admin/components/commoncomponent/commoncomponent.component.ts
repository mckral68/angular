import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewEncapsulation,
  inject,
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
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { DataService } from 'app/services/admin/data.service';
import { CommonService } from 'app/services/common/common.service';
import { Modal } from 'bootstrap';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../utils/breadcrumb/breadcrumb.component';
@Component({
  selector: 'commoncomponent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DeleteDirective,
    BreadcrumbComponent,
  ],
  providers: [CommonService],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './commoncomponent.component.html',
  styleUrl: './commoncomponent.component.scss',
})
export class CommoncomponentComponent implements OnInit {
  @Input() paginatedItems: ItemType[] = []; // Görünen öğeleri tutar
  @Input() isSelected: boolean = false;
  @Input() idList: number[] = [];
  formFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  @Input() itemoptions: Partial<Itemoptions>;
  @Output() itemAdded = new EventEmitter<Attribute | any>();
  @Output() itemUpdated = new EventEmitter<ItemType | any>();
  @Output() statusChanged = new EventEmitter<Attribute | AttributeValue>();
  @Output() callbackFunc = new EventEmitter<void>();
  editMode: boolean = false;
  form: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 4; // Her sayfada kaç öğe gösterileceği
  totalPages: number = 0;
  pages: number[] = []; // Sayfa numaralarını tutar
  item: ItemType = {
    id: '',
    name: '',
    value: '',
    status: true,
  };
  private modal: Modal;
  private _commonService = inject(CommonService);
  private dataService = inject(DataService);
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }
  async ngOnInit(): Promise<void> {
    this.dataService.formFields$.subscribe((fields) => {
      this.formFields = fields; // Form alanlarını al
      this.initializeFormControls(); // Kontrolleri oluştur
    });
    this.dataService.breadCrumbItems$.subscribe(
      (b) => (this.breadcrumbItems = b)
    );
  }
  ngOnChanges() {
    if (this.paginatedItems) {
      // Paginated items'ın bir dizi olduğunu kontrol edin
      if (this.paginatedItems.length > 0) {
        this.totalPages = Math.ceil(
          this.paginatedItems.length / this.itemsPerPage
        );
        this.updatePaginatedItems();
        this.generatePageNumbers();
      }
    }
    this.initializeFormControls();
  }
  private initializeFormControls(): void {
    this.formFields.forEach((field) => {
      this.form.addControl(
        field.name,
        this.fb.control(
          field.value || '',
          field.required ? Validators.required : null
        )
      );
    });
  }

  updatePaginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedItems = this.paginatedItems.slice(
      start,
      start + this.itemsPerPage
    );
  }

  generatePageNumbers() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedItems();
  }
  callBack() {
    this.callbackFunc.emit();
  }
  checkAll() {
    this.isSelected = !this.isSelected;
    this.isSelected
      ? this.paginatedItems.forEach(
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

  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this._commonService
        .add(this.itemoptions.controller + '/' + this.itemoptions.addAction, {
          Category: this.form.value,
        })
        .subscribe((a) => (a.succeeded ? this.callBack() : ''));
    }
  }
  changeMode(m: boolean, item?: ItemType) {
    this.editMode = m;
    const patchObject = {};
    if (this.editMode) {
      this.initializeFormControls();
    } else {
      this.initializeFormControls();
    }
  }

  changeStatus(a: ItemType) {
    a.status = !a.status;
    this._commonService
      .update(this.itemoptions.controller + '/' + this.itemoptions.updAction, {
        [this.itemoptions.objectName]: a,
      })
      .subscribe();
  }
  activeState() {
    this._commonService
      .add(
        `${this.itemoptions.controller + '/' + this.itemoptions.updateStatus}`,
        { ids: this.idList }
      )
      .subscribe((a) => (a.succeeded ? this.callBack() : ''));
    // this.productService
    //   .updateAttributeList(this.idList)
    //   .then(async () => await this.getAllAttributes());
  }
}
export interface Itemoptions {
  controller?: string;
  removeAction?: string;
  addAction?: string;
  updAction?: string;
  objectName: string;
  updateStatus: string;
}
export class ItemType {
  id?: string;
  name: string;
  value?: string;
  status?: boolean;
}
