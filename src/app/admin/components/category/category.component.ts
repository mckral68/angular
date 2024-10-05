import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
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
import { DeleteDirectiveModule } from 'app/directives/admin/delete.directive.module';
import { DialogService } from 'app/services/common/dialog.service';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';

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
    DeleteDirectiveModule,
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

  async ngOnInit() {
    await this.getAllCat();
  }
  async updateData() {
    await this.categoryService.getAllCategories();
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
      this.category = this.categoryForm.value;
    }
    await this.categoryService.update(a.id, a.name).then(async (r) => {
      if (r.succeeded) {
        await this.getAllCat();
      }
    });
    this.editMode = false;
  }
}
