import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { AllProductComment } from './../../../contracts/create_product';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommentService } from 'app/services/common/models/comment.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  private customToastrService = inject(CustomToastrService);
  private commentService = inject(CommentService);

  comments: AllProductComment[];
  assessmentcomments: AllProductComment[];
  async ngOnInit(): Promise<void> {
    await this.getAllComment();
  }
  private async getAllComment() {
    await this.commentService.getAllPrdComment(0, 5).then((a) => {
      this.commentCompile(a.comments);
    });
  }
  private async commentCompile(prdComment: AllProductComment[]) {
    this.comments = prdComment.filter((a) => !a.isAdminAssessment);
    this.assessmentcomments = prdComment.filter((a) => a.isAdminAssessment);
  }
  async approval(id: string, isApproval: boolean) {
    await this.commentService
      .approvalComment(id, isApproval)
      .then((a) =>
        a.succeded
          ? this.customToastrService.message(
              'Yorum onayı başarıyla güncellendi',
              'Başarılı',
              {
                messageType: ToastrMessageType.Info,
                position: ToastrPosition.TopFullWidth,
              }
            )
          : this.customToastrService.message(
              'Yorum onayı gerçekleşemedi',
              'Başarısız',
              {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopFullWidth,
              }
            )
      );
    await this.getAllComment();
  }
  async pageChanged(e: PageEvent) {
    await this.commentService
      .getAllPrdComment(e.pageIndex, e.pageSize)
      .then(async (a) => await this.commentCompile(a.comments));
  }
}
