import { Create_Product, Edit_Product } from './../../../../contracts/create_product';
import { SpinnerType } from './../../../../base/base.component';
import { CommonModule } from '@angular/common';
import { EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Attribute, AttributeValue } from 'app/contracts/variable_option.model';
import { Category } from 'app/services/common/models/category.model';
import { CategoryService } from 'app/services/common/models/category.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, } from '../../../../base/base.component';
import { AlertifyService } from '../../../../services/admin/alertify.service';
import { ProductService } from '../../../../services/common/models/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionVarOptions } from 'app/contracts/SessionVarOptions';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'], standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, MatButtonModule, MatExpansionModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(spiner: NgxSpinnerService, private fb: FormBuilder, private toastrService: CustomToastrService, private productService: ProductService, private alertify: AlertifyService, private categoryService: CategoryService) {
    super(spiner)
    this.productForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      id: [null],
      description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      categoryIds: [null, [Validators.required]],
      regularPrice: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      salePrice: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      isHome: [false, [Validators.required,]],
      variations: this.fb.group({
        colorId: [null, [Validators.required]],
        sizeId: [null, [Validators.required]],
        qty: [null, [Validators.required]],
        isDiscounted: [null, [Validators.required]],
      }),
    })
  }
  productForm: FormGroup
  panelOpenState = false;
  attributes: Attribute[] = []
  values: AttributeValue[] = []
  toppingList: string[] = []
  sessionVariation: SessionVarOptions[] = []
  categoryList: Category[] = []
  description: string
  isEditMode: boolean = false
  catSelected: string[]
  async ngOnInit() {

  }
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Output() createdProduct = new EventEmitter<Create_Product>()
  @Output() updatedProduct = new EventEmitter<Create_Product>()
  async create(product: Create_Product) {
    product.variations = this.sessionVariation
    if (this.productForm.invalid)
      return;
    this.productForm.reset()
    await this.productService.createProduct(product)
    this.createdProduct.emit(product)
    // if (result.succeeded) {
    //   this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı", {
    //     messageType: ToastrMessageType.Success,
    //     position: ToastrPosition.TopRight
    //   })
    // }
    // else
    //   this.toastrService.message(result.message, "Hata", {
    //     messageType: ToastrMessageType.Error,
    //     position: ToastrPosition.TopRight
    //   })
  }
  async crtPrd(e:boolean){
    e ? await this.onload() : null
  }
  async onload(){
    await this.categoryService.getAllCategories().then(res => this.categoryList = res.categories)
    await this.productService.getAllAttributes().then(res => this.attributes = res.attributes)
    await this.productService.getAllAttributeValues().then(res => this.values = res.values)
  }
  async saveVariation() {
    if (this.productForm.controls["variations"].value.qty >= 0) {
      if (this.sessionVariation.map(va => va['colorId'] + va['sizeId']).includes(this.productForm.controls["variations"].value.colorId + this.productForm.controls["variations"].value.sizeId)) {
        const index = this.sessionVariation.map(va => va['colorId'] + va['sizeId']).findIndex(v => v === this.productForm.controls["variations"].value.colorId + this.productForm.controls["variations"].value.sizeId)
        this.sessionVariation.splice(index, 1)
        this.sessionVariation.push(this.productForm.controls["variations"].value)

      } else {
        this.sessionVariation.push(this.productForm.controls["variations"].value)
        this.toastrService.message("Opsiyion başarıyla kaydedildi", "Başarılı", { messageType: ToastrMessageType.Info, position: ToastrPosition.TopFullWidth })
      }
    } else {
      return
    }
  }
  async editPrd(prd: Edit_Product) {
    this.productForm.controls["name"].setValue(prd.name)
    this.productForm.controls["description"].setValue(prd.description)
    this.productForm.controls["categoryIds"].setValue(prd['kategoriAdlari'])
    this.productForm.controls["price"].setValue(prd.price)
    this.productForm.controls["id"].setValue(prd.id)
    this.productForm.controls["isDiscounted"].setValue(prd.isDiscounted)
    this.productForm.controls["isHome"].setValue(prd.isHome)
    this.isEditMode = true
  }
  compareObjects(o1: string, o2: any) {
    return o1 && o2 ? o1 === o2.id : o1 === o2;
  }
  async updateProduct(prd: Create_Product) {
    this.showSpinner(SpinnerType.LineScalePulseOut)
    if (this.productForm.invalid)
      return;
    await this.productService.updateProduct(prd)
    this.productForm.reset()
    this.hideSpinner(SpinnerType.LineScalePulseOut)
    this.updatedProduct.emit(prd)
  }
  async resetForm() {
    this.productForm.reset()
    this.isEditMode = false
  }
}
