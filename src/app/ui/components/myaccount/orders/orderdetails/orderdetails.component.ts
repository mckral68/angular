import { Message } from './../../../../../services/common/models/seller-question';
import { Component, ViewEncapsulation, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from 'app/services/common/models/order.service';
import { OrderInfo } from 'app/contracts/order/orderDetail';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';
import { SubjectService } from 'app/services/common/models/subject.service';
import { Subject } from 'app/services/common/models/subject.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SellerQuestion } from 'app/services/common/models/seller-question';
import { SellerQuestionService } from 'app/services/common/models/seller-question.service';

@Component({
  selector: 'app-orderdetails',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, NgOptimizedImage, ReactiveFormsModule],
  providers: [ConvertEngPipe],
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss'],
})
export class OrderdetailsComponent implements OnInit {
  private orderService = inject(OrderService);
  private subjectService = inject(SubjectService);
  private sellerQuestionService = inject(SellerQuestionService);
  private activatedRoute = inject(ActivatedRoute);
  private toastrService = inject(CustomToastrService);
  private convertEng = inject(ConvertEngPipe);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  constructor() {
    this.sellerAskForm = this.fb.group({
      subjectId: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      message: this.fb.group({
        owner: [false, [Validators.required]],
        text: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      }),
    });
  }
  odList = [];
  orderInfo: OrderInfo;
  transactStatus: string;
  total: number;
  subjects: Subject[];
  sellerAskForm: FormGroup;
  message: Message[];
  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe(
      async (b) => await this.getOrderDetails(b.get('od'))
    );
    this.subjects = (await this.subjectService.getAllSubjects()).subjects;
  }

  async getOrderDetails(od: string) {
    await this.orderService.getDetailByOrderNumber(od).then((res) => {
      this.odList = res.shipments;
      this.orderInfo = res.info;
    });
    switch (this.orderInfo.transactStatus) {
      case 0:
        this.transactStatus = 'Sipariş Alındı';
        break;
      case 1:
        this.transactStatus = 'Sipariş Hazırlanıyor';
        break;
      case 2:
        this.transactStatus = 'Kargoya Verildi';
        break;
      case 3:
        this.transactStatus = 'Teslim Edildi';
        break;
      case 4:
        this.transactStatus = 'İptal Edildi';
        break;
      case 5:
        this.transactStatus = 'İade Edildi';
        break;
    }
    this.total = this.odList
      .map((a) => a.quantity * a.unitPrice)
      .reduce((a, b) => a + b);
  }
  async cancelOrder(id: string) {
    await this.orderService.updateOrderByAdmin(id, '4').then((a) =>
      a
        ? this.toastrService.message(
            'Siparişiniz başarıyla iptal edilmiştir. Sisteme yansıması biraz zaman alabilir. Anlayışınız için teşekkür ederiz.',
            'İşlem Başarılı',
            {
              messageType: ToastrMessageType.Info,
              position: ToastrPosition.TopFullWidth,
            }
          )
        : this.toastrService.message(
            'Sipariş iptal edilirken bir sorun oluştu.',
            'Hata alındı.',
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopFullWidth,
            }
          )
    );
    this.router.navigate(['/hesabim/siparislerim']);
  }
  redirect(name: string, id: string) {
    this.router.navigate(['/' + this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
  async askSeller(a: SellerQuestion) {
    a.orderId = this.orderInfo.id;
    a.userId = JSON.parse(localStorage.getItem('customer'))?.id;
    await this.sellerQuestionService.createQuestion(a).then((a) => {
      this.toastrService.message(
        'Mesajınız başarıyla satıcıya iletilmiştir. Hesabım sayfasında sorularım bölümünden takip edebilirsiniz.',
        'Başarılı',
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopFullWidth,
        }
      );
      this.sellerAskForm.reset();
    });
  }
}
