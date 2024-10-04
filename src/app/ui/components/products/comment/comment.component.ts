import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComment } from 'app/contracts/create_product';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentService } from 'app/services/common/models/comment.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbRatingModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent implements OnInit {
  private activatedRoute=inject(ActivatedRoute)
  private router=inject(Router)
  private commentService=inject(CommentService)
  constructor(

  ) {
    this.getprevUrl();
  }
  prevUrl: string = '';
  name: string;
  index: number;
  prdId: string;
  prdName: string;
  catName: string;
  totalRankScore: number;
  avgScore: number;
  comment: ProductComment[];
  count = {};
  async ngOnInit(): Promise<void> {
    await this.getProductComment();
    await this.calcRank();
  }

  private async getprevUrl() {
    this.activatedRoute.queryParams.subscribe((a) => (this.prdId = a['p']));
  }

  redirectTo() {
    this.activatedRoute.params.subscribe((params) => {
      this.prdName = params.name;
    });
    this.router.navigate([this.prdName], { queryParams: { p: this.prdId } });
  }

  private async getProductComment() {
    this.comment = (
      await this.commentService.getPrdComment(this.prdId)
    ).comment;
  }
  private async calcRank() {
    if (this.comment && this.comment.length > 0) {
      this.avgScore =
        this.comment?.map((a) => a.rankScore).reduce((a, b) => +a + +b) /
        this.comment.length;
      this.comment.forEach((e) => {
        this.count[e.rankScore] = (this.count[e.rankScore] || 0) + 1;
      });
    }
  }
}
