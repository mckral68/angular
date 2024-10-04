import { EditComment } from './../../../contracts/create_product';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from './../../../services/ui/custom-toastr.service';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CreatePrdComment, EditPrdComment } from 'app/contracts/simpleProduct';
import { CommentService } from 'app/services/common/models/comment.service';
declare const require: any;

@Component({
  selector: 'app-comment',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgbRatingModule,
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private commentService = inject(CommentService);
  private customToastr = inject(CustomToastrService);
  private fb = inject(FormBuilder);
  constructor() {
    this.prdComment = this.fb.group({
      id: [null],
      content: [null, [Validators.required]],
      prdId: [null],
      rateScore: [null, [Validators.required]],
      isNameShow: [null, [Validators.required]],
    });
  }
  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe((a) => (this.id = a['p']));
    this.activatedRoute.queryParams.subscribe(
      (a) => (this.queryparams = a['from'])
    );
    if (this.queryparams !== 'product-review') {
      await this.commentService
        .getCommentById(this.id)
        .then((b) => (this.editComment = b.comment[0]));
      this.prdComment.controls['content'].setValue(this.editComment.content);
      this.prdComment.controls['isNameShow'].setValue(
        this.editComment.isNameShow
      );
      this.prdComment.controls['rateScore'].setValue(
        this.editComment.rankScore
      );
      this.prdComment.controls['id'].setValue(this.id);
      this.path = this.editComment.path[0].path;
      this.name = this.editComment.name;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }
  path: string;
  name: string;
  prdComment: FormGroup;
  email: string;
  id: string;
  prdId: string;
  queryparams: string;
  isEditMode: boolean = false;
  editComment: EditComment;

  async submitComment(cmt: CreatePrdComment) {
    cmt.userId = JSON.parse(localStorage.getItem('customer'))?.id;
    cmt.prdId = this.id;
    if (this.prdComment.invalid) {
      this.customToastr.message(
        'Hata Alındı',
        'Lütfen formu eksiksiz doldurunuz.',
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopFullWidth,
        }
      );
      return;
    }
    await this.commentService.createPrdComment(cmt).then((res) =>
      this.customToastr.message(
        'Yorumunuz incelendikten sonra yayına en kısa sürede alınacaktır.',
        'Başarılı',
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopFullWidth,
        }
      )
    );
    this.router.navigate(['/hesabim']);
    this.prdComment.reset();
  }
  async updateComment(cmt: EditPrdComment) {
    await this.commentService.updatePrdComment(cmt).then((res) =>
      this.customToastr.message(
        'Yorum başarıyla güncellendi',
        'Yorum güncellendi',
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopFullWidth,
        }
      )
    );
    this.router.navigateByUrl('/hesabim/degerlendirmelerim');
  }
  private async decrypt() {
    if (!!JSON.parse(localStorage.getItem('customer'))) {
      const veri = JSON.parse(localStorage.getItem('customer'))['email'];
      var CryptoTS = require('crypto-ts');
      var bytes = CryptoTS.AES.decrypt(veri, 'ogfdo@.,12_');
      var plaintext = bytes.toString(CryptoTS.enc.Utf8);
      this.email = plaintext;
    } else {
      return;
    }
  }

}
