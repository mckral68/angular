import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { DialogService } from 'app/services/common/dialog.service';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import {
  CommoncomponentComponent,
  Itemoptions,
} from '../commoncomponent/commoncomponent.component';
import { DataService } from 'app/services/admin/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgOptimizedImage,
    DeleteDirective,
    CommoncomponentComponent,
  ],
  providers: [DialogService],
})
export class CategoryComponent implements OnInit {
  constructor() {
    this.categoryForm = this.fb.group({
      name: [null, [Validators.minLength(2), Validators.maxLength(20)]],
      id: [null],
      no: [null],
      pid: [null],
      file: [null],
    });
  }
  private categoryService = inject(CategoryService);
  private dataService = inject(DataService);

  private fb = inject(FormBuilder);
  @ViewChild('modal') modal: TemplateRef<any>;
  @ViewChild('image') image: TemplateRef<any>;
  categories: Category[] = [];
  editMode: boolean = false;
  isSelected: boolean = false;
  idList: number[] = [];
  allSelected: boolean = false;
  path: string = '';
  category: Category;
  categoryForm: FormGroup;
  fileToUpload: File | null = null;
  formFields: object[] = [];
  @Output() itemoptions: Partial<Itemoptions> = {
    addAction: 'CreateCategory',
    removeAction: 'Delete',
    controller: 'category',
    updAction: 'UpdateCategory',
    objectName: 'category',
  };
  async ngOnInit() {
    await this.getAllCat();
    this.initializeFormFields();
  }
  async updateData() {
    await this.categoryService.getAllCategories();
  }
  handleItemSelected(item: Category) {
    console.log(item); // Child bileşeninden gelen öğeyi işleyin.
  }
  private initializeFormFields() {
    this.formFields = [
      {
        type: 'hidden',
        name: 'id',
        value: '',
        label: 'id',
        required: false,
      },
      {
        type: 'text',
        name: 'name',
        value: '',
        label: 'Kategori Adı',
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
    this.dataService.updateFormFields(this.formFields);
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    const fileData: FormData = new FormData();
    fileData.append(this.fileToUpload.name, this.fileToUpload);
    this.categoryForm.controls['file'].setValue(fileData);
  }

  async getAllCat() {
    await this.categoryService
      .getAllCategories()
      .then((res) => (this.categories = res.categories));
  }

  activeState() {
    this.categoryService
      .getAllCategories()
      .then(async () => await this.getAllCat());
  }
  async addValue(cat: Category) {
    if (this.categoryForm.invalid) {
      return;
    } else {
      await this.categoryService
        .create(this.categoryForm.value)
        .then(async (r) => {
          if (r.succeeded) {
            await this.getAllCat();
          }
        });
    }
  }
  checkAll() {
    this.isSelected = !this.isSelected;
    this.isSelected
      ? this.categories.forEach(
          (a) => (this.idList = [...new Set(this.idList), +a.id])
        )
      : (this.idList = []);
    this.idList = [...new Set(this.idList)];
  }
  openModal(imagePath: string) {
    this.path = imagePath;
    const modal = new Modal(document.getElementById('openImage'));
    modal.show();
  }
  changeMode(m: boolean, category?: Category) {
    this.editMode = m;
    this.editMode ? (this.category = category) : '';
  }
  async changeStatus(a: Category) {
    a.status = !a.status;
    await this.updateCategory(a);
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
  async updateCategory(a: Category) {
    if (this.editMode) {
      this.category = a;
    }
    await this.categoryService.update(a.id, a.name).then(async (r) => {
      if (r.succeeded) {
        await this.getAllCat();
      }
    });
    this.editMode = false;
  }
}
