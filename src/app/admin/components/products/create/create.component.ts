import {
  Create_Product,
  Edit_Product,
} from './../../../../contracts/create_product';
import { SpinnerType } from './../../../../base/base.component';
import { CommonModule } from '@angular/common';
import { EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Attribute, AttributeValue } from 'app/contracts/variable_option.model';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '../../../../base/base.component';
import { AlertifyService } from '../../../../services/admin/alertify.service';
import { ProductService } from '../../../../services/common/models/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SessionVarOptions } from 'app/contracts/SessionVarOptions';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(
    spiner: NgxSpinnerService,
    private fb: FormBuilder,
    private toastrService: CustomToastrService,
    private productService: ProductService,
    private alertify: AlertifyService,
    private categoryService: CategoryService
  ) {
    super(spiner);
    this.productForm = this.fb.group({
      categoryId: [null, Validators.required],
      name: ['', Validators.required],
      description: [''],
      isStock: [null],
      isHome: [null],
      status: [null],
      sku: ['', Validators.required],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      regularPrice: [null, [Validators.required, Validators.min(0)]],
    });
  }
  productForm: FormGroup;
  categories: Category[];
  async ngOnInit() {
    await this.getCategories();
  }
  @Output() createdProduct = new EventEmitter<Create_Product>();
  @Output() updatedProduct = new EventEmitter<Create_Product>();

  async getCategories() {
    await this.categoryService
      .getAllCategories()
      .then((a) => (this.categories = a.categories));
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
