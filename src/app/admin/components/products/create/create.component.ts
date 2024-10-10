import { Create_Product } from './../../../../contracts/create_product';
import { CommonModule } from '@angular/common';
import { EventEmitter, inject, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { Attribute } from 'app/contracts/variable_option.model';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import { CustomToastrService } from 'app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '../../../../base/base.component';
import { ProductService } from '../../../../services/common/models/product.service';
import { RouterModule } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class CreateComponent extends BaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastrService = inject(CustomToastrService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  @Output() createdProduct = new EventEmitter<Create_Product>();
  @Output() updatedProduct = new EventEmitter<Create_Product>();

  constructor(spiner: NgxSpinnerService) {
    super(spiner);
    this.productForm = this.fb.group({
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      isStock: [true],
      isHome: [false],
      status: [null],
      sku: ['', Validators.required],
      salePrice: [0, Validators.required],
      regularPrice: [0, Validators.required],
      variations: this.fb.array([]),
    });
  }
  get variations(): FormArray {
    return this.productForm.get('variations') as FormArray;
  }
  productForm: FormGroup;
  attributes: Attribute[];
  attributeValues: Attr[];
  categories: Category[];
  selectedAttributeValues: { [key: number]: number[] } = {};
  async ngOnInit() {
    await this.getCategories();
    await this.getValues();
  }
  async getValues() {
    await this.productService
      .getAllAttributes()
      .then((a) => (this.attributes = a.data.attributes));
  }
  async getCategories() {
    await this.categoryService
      .getAllCategories()
      .then((a) => (this.categories = a.data));
  }

  onAttributeChange(event: Event, attributeIndex: number) {
    const checkbox = event.target as HTMLInputElement;
    const variation = this.variations.at(attributeIndex) as FormGroup;

    // Burada selectedAttributeValues kontrolü var mı diye kontrol ediyoruz
    const selectedValues = variation.get(
      'selectedAttributeValues'
    ) as FormArray;

    // Kontrolü sağlamak için daha önceden eklediğimiz `addVariation` fonksiyonunun çalıştığından emin olun
    if (!selectedValues) {
      console.error(
        'selectedAttributeValues not found for variation at index',
        attributeIndex
      );
      return; // Hata durumunda işlemi sonlandır
    }

    if (checkbox.checked) {
      selectedValues.push(this.fb.control(checkbox.value));
    } else {
      const index = selectedValues.controls.findIndex(
        (ctrl) => ctrl.value === checkbox.value
      );
      if (index >= 0) {
        selectedValues.removeAt(index);
      }
    }
  }

  addVariation() {
    const variation = this.fb.group({
      isActive: [false],
      selectedAttributeValues: this.fb.array([]), // Seçilen attribute değerleri için FormArray
      price: [null],
      stock: [null],
      images: [null],
    });

    this.variations.push(variation);
  }

  getSelectedAttributes(variation: FormGroup): string {
    const selectedValues = variation.get(
      'selectedAttributeValues'
    ) as FormArray;

    if (!selectedValues) {
      console.error(
        'selectedAttributeValues not found in the variation',
        variation
      );
      return 'Hiçbir değer seçilmedi';
    }

    const selectedAttributes = selectedValues.value || [];
    return selectedAttributes.length
      ? selectedAttributes.join(', ')
      : 'Hiçbir değer seçilmedi';
  }

  onImageChange(event: any, variation: any) {
    const files = event.target.files;
    variation.images = Array.from(files);
  }

  removeVariation(index: number) {
    this.variations.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).then(
        (response) => {
          console.log('Ürün başarıyla oluşturuldu:', response);
          // Başarı mesajı göster, yönlendirme yap, vb.
        },
        (error) => {
          console.error('Hata oluştu:', error);
          // Hata mesajı göster
        }
      );
    }
  }
}
