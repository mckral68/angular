import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GetCommentsByUserId } from 'app/contracts/create_product';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentService } from 'app/services/common/models/comment.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, NgbRatingModule],
  providers:[ConvertEngPipe],
  templateUrl: './assessments.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./assessments.component.scss'],
})
export class AssessmentsComponent implements OnInit {
  private router = inject(Router);
  private commentService = inject(CommentService);
  private customToastr = inject(CustomToastrService);
  private convertEng = inject(ConvertEngPipe);
  inside: boolean;
  menuListOpen(a: string) {
    this.menuNumber = this.myReview.findIndex((b) => b.id == a);
    this.inside = true;
  }

  reviewableComments: [];
  approvedComments: GetCommentsByUserId[];
  rejectComments: GetCommentsByUserId[];
  myReview: GetCommentsByUserId[];
  async ngOnInit(): Promise<void> {
    const userId = JSON.parse(localStorage.getItem('customer'))?.id;
    await this.commentService.getReviewableComment(userId).then((a) => {
      (this.reviewableComments = a.reviewableComments),
        (this.rejectComments = a.rejectComments[0]);
      this.approvedComments = a.approvedComments[0];
    });

    this.myReview = this.reviewableComments;
  }
  async redirectTo(mc: GetCommentsByUserId) {
    this.router.navigate([this.convertEng.transform(mc.name)], {
      queryParams: { p: mc.prdId },
    });
  }
  clicked: number = 2;
  async approvedComment(a: number) {
    switch (a) {
      case 0:
        (this.clicked = 0),
          this.rejectComments[0] == undefined
            ? (this.myReview = [])
            : (this.myReview = this.rejectComments);
        return this.myReview;
      case 1:
        (this.clicked = 1),
          this.approvedComments[0] == undefined
            ? (this.myReview = [])
            : (this.myReview = this.approvedComments);
        return this.myReview;
      case 2:
        (this.clicked = 2), (this.myReview = this.reviewableComments);
        return this.myReview;
      default:
        return (this.myReview = this.reviewableComments);
    }
  }
  menuNumber: number;

  goComment(name: string, ids: string) {
    this.router.navigate([this.convertEng.transform(name) + '/yorum-yap/' + ids], {
      queryParams: { from: 'edit-comment' },
    });
  }
  redirect(name: string, id: string) {
    this.router.navigate(['/' + this.convertEng.transform(name) + '/yorum-yap/' + id], {
      queryParams: { from: 'product-review' },
    });
  }
  async remove(id: string) {
    await this.commentService.removeComment(id).then((a) => {
      if (a.isSucceeded) {
        this.customToastr.message(
          'Yorumunuz başarıyla kaldırıldı.Sisteme yansıması bir kaç dakika sürebilir.',
          'Başarılı',
          {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopFullWidth,
          }
        );
      }
      this.router.navigate(['hesabim/degerlendirmelerim']);
    });
  }
}
