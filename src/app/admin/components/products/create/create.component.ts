import {
  Create_Product,
  ProductType,
} from './../../../../contracts/create_product';
import { CommonModule } from '@angular/common';
import { EventEmitter, inject, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import {
  Attribute,
  AttributeValue,
  Variation,
} from 'app/contracts/variable_option.model';
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
  ProductType = ProductType;

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
      productType: [ProductType.SimpleProduct, Validators.required],
      regularPrice: [0, Validators.required],
      variations: this.fb.array([]),
    });
  }
  // get variations(): FormArray {
  //   return this.productForm.get('variations') as FormArray;
  // }
  productForm: FormGroup;
  attributes: Attribute[];
  attributeValues: Attr[];
  variations: Variation[] = [];
  categories: Category[];
  combinations: Variation[] = [];
  isVariableProduct: boolean = false;
  selectedValues: { [key: string]: Set<number> } = {};
  async ngOnInit() {
    await this.getCategories();
    await this.getValues();
  }
  async getValues() {
    await this.productService
      .getAllAttributes()
      .then((a) => (this.attributes = a.data.attributes));
    this.generateCombinations();
  }
  onAttributeValueChange(value: AttributeValue, attribute: Attribute) {
    if (!this.selectedValues[attribute.name]) {
      this.selectedValues[attribute.name] = new Set(); // Eğer attribute için seçim yoksa yeni bir Set oluştur
    }

    if (this.selectedValues[attribute.name].has(+value.id)) {
      this.selectedValues[attribute.name].delete(+value.id); // Seçimi kaldır
    } else {
      this.selectedValues[attribute.name].add(+value.id); // Seçimi ekle
    }
  }
  async getCategories() {
    await this.categoryService
      .getAllCategories()
      .then((a) => (this.categories = a.data));
  }
  isLast(value: AttributeValue, values: AttributeValue[]): boolean {
    return values[values.length - 1].id === value.id; // Son elemanı kontrol et
  }
  isValueSelected(value: AttributeValue): boolean {
    for (const key in this.selectedValues) {
      if (this.selectedValues[key].has(+value.id)) {
        return true; // Eğer değer zaten seçilmişse
      }
    }
    return false;
  }
  onProductTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.isVariableProduct = selectElement.value === '1'; // 1: Variable Product
    if (!this.isVariableProduct) {
      this.clearVariations(); // Simple Product seçildiğinde varyasyonları temizle
    }
  }
  clearVariations() {
    const variationsArray = this.productForm.get('variations') as FormArray;
    variationsArray.clear(); // Varyasyonları temizle
    this.combinations = []; // Oluşturulan kombinasyonları sıfırla
    this.selectedValues = {}; // Seçilen değerleri sıfırla
  }
  generateCombinations() {
    const combinations: Variation[] = [];
    // Tüm seçilen değerleri bir araya getir
    const selectedAttributeValues = Object.keys(this.selectedValues).map(
      (attributeName) => {
        const selectedIds = Array.from(this.selectedValues[attributeName]);
        return this.attributes
          .find((attr) => attr.name === attributeName)
          ?.attributeValues.filter((value) => selectedIds.includes(+value.id));
      }
    );

    // Kombinasyonları oluştur
    this.cartesianProduct(selectedAttributeValues).forEach((combination) => {
      combinations.push({
        id: combinations.length + 1,
        salePrice: 0,
        quantity: 0,
        imageUrl: '',
        attributeValues: combination,
      });
    });
    const variationsArray = this.productForm.get('variations') as FormArray;
    variationsArray.clear(); // Önceki varyasyonları temizle

    combinations.forEach((combination) => {
      variationsArray.push(
        this.fb.group({
          salePrice: [combination.salePrice, Validators.required],
          quantity: [combination.quantity, Validators.required],
          sku: [combination.sku, Validators.required],
          imageUrl: [combination.imageUrl],
          attributeValues: [combination.attributeValues],
        })
      );
    });
    // Kombinasyonları güncelle
    this.combinations = combinations;
  }
  cartesianProduct(arrays: any[]): any[][] {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    );
  }

  createUniqueCombinations(selectedValues: any[]): any[][] {
    // Benzersiz kombinasyonları döndür
    return selectedValues.map((value) => [value]);
  }
  getControls() {
    return (this.productForm.get('variations') as FormArray).controls;
  }
  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        productType: Number(this.productForm.value.productType), // Enum değerini al
      };
      this.productService.createProduct(productData).then(
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
