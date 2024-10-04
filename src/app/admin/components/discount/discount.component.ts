import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DiscountService } from 'app/services/common/models/discount.service';
import { Discount } from 'app/services/common/models/discount.model';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-category',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class DiscountComponent extends BaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private discountService = inject(DiscountService);
  private toastrService = inject(CustomToastrService);
  constructor(spinner: NgxSpinnerService) {
    super(spinner);

    this.discountForm = this.fb.group({
      id: [null],
      name: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
      toAllCartItem: [false, [Validators.required]],
      isActive: [false, [Validators.required]],
      isExpirationDate: [false, [Validators.required]],
      discount_type: [0, [Validators.required]],
      discountAmount: [null, [Validators.required]],
      maxDiscountAmount: [null, [Validators.required]],
      lowerLimit: [null, [Validators.required]],
      usageLimit: [null, [Validators.required]],
      expireTime: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
    });
  }

  discountForm: FormGroup;
  discounts: Discount[] = [];
  async ngOnInit() {
    await this.getAllDiscounts();
  }

  async updateData() {
    await this.discountService.getAllDiscounts();
  }
  async getAllDiscounts() {
    this.showSpinner(SpinnerType.BallAtom);
    await this.discountService
      .getAllDiscounts()
      .then((res) => (this.discounts = res.discounts));
    this.hideSpinner(SpinnerType.BallAtom);
  }
  editDiscount(discount: Discount) {
    this.updMode = true;
    this.discountForm.setValue({
      id: discount.id,
      name: discount.name,
      description: discount.description,
      toAllCartItem: discount.toAllCartItem,
      isActive: discount.isActive,
      discount_type: discount.discount_type,
      discountAmount: discount.discountAmount,
      maxDiscountAmount: discount.maxDiscountAmount,
      lowerLimit: discount.lowerLimit,
      usageLimit: discount.usageLimit,
      isExpirationDate: discount.isExpirationDate,
      startDate: new Date(discount.startDate).toISOString().substring(0, 10),
      expireTime: new Date(discount.expireTime).toISOString().substring(0, 10),
    });
  }
  updMode: boolean = false;
  async upDiscount(discount: Discount) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.discountService
      .update(discount)
      .then(async (a) => {
        if (a.isSucceeded) {
          this.toastrService.message(
            'İndirim başarıyla güncellendi.',
            'Başarılı',
            {
              messageType: ToastrMessageType.Info,
              position: ToastrPosition.TopFullWidth,
            }
          );
          this.discountForm.reset();
          await this.getAllDiscounts();
        } else {
          this.toastrService.message(
            'İndirim güncellenirken oluşturulurken bir sorun oluştu.',
            'Hata Oluştu',
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopFullWidth,
            }
          );
        }
      })
      .then(() => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.updMode = false;
      });
  }
  async create(discount: Discount) {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    await this.discountService.create(discount).then(async (a) => {
      if (a.isSucceeded) {
        this.toastrService.message(
          'İndirim başarıyla oluşturuldu.',
          'Başarılı',
          {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopFullWidth,
          }
        );
        this.discountForm.reset();
        await this.getAllDiscounts();
      } else {
        this.toastrService.message(
          'İndirim oluşturulurken bir sorun oluştu.',
          'Hata Oluştu',
          {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopFullWidth,
          }
        );
      }
      this.hideSpinner(SpinnerType.LineScalePulseOut);
    });
  }
  async remove(id: string) {
    await this.discountService.remove(id).then(async () => {
      await this.getAllDiscounts();
    });
  }
}
