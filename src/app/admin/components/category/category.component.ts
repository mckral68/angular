import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  Output,
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
import {
  BreadcrumbItem,
  BreadcrumbComponent,
} from 'app/admin/utils/breadcrumb/breadcrumb.component';

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
    BreadcrumbComponent,
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
  private fb = inject(FormBuilder);
  categories: Category[] = [];
  editMode: boolean = false;
  isSelected: boolean = false;
  idList: number[] = [];
  path: string = '';
  category: Category;
  categoryForm: FormGroup;
  selectedFile: File | null = null;
  @Output() itemoptions: Partial<Itemoptions> = {
    addAction: 'CreateCategory',
    removeAction: 'Delete',
    controller: 'category',
    updAction: 'UpdateCategory',
    objectName: 'category',
    isOption: false,
  };
  async ngOnInit() {
    await this.getAllCat();
  }

  async updateData() {
    await this.categoryService.getAllCategories();
  }
  handleItemSelected(item: Category) {
    console.log(item); // Child bileşeninden gelen öğeyi işleyin.
  }

  handleFileInput(file: FileList) {
    if (file && file.length > 0) {
      this.selectedFile = file.item(0);
    }
  }
  async getAllCat() {
    await this.categoryService
      .getAllCategories()
      .then((res) => (this.categories = res.data));
  }

  activeState() {
    this.categoryService
      .getAllCategories()
      .then(async () => await this.getAllCat());
  }
  async submitCreateForm(cat: Category) {
    if (this.categoryForm.invalid) {
      return;
    } else {
      await this.categoryService.create(this.sendForm()).then(async (r) => {
        if (r.isSuccessful) {
          await this.getAllCat();
        }
      });
    }
  }
  sendForm(): FormData {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append(
        'Category.File',
        this.selectedFile,
        this.selectedFile.name
      );
    }
    Object.keys(this.categoryForm.value).forEach((key) => {
      const value = this.categoryForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(
          `Category.${key.charAt(0).toUpperCase() + key.slice(1)}`,
          value
        );
      }
    });
    return formData;
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
    await this.categoryService.update(this.sendForm()).then(async (r) => {
      if (r.succeeded) {
        await this.getAllCat();
      }
    });
    this.editMode = false;
  }
}
