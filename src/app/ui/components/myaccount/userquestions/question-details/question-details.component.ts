import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerQuestionService } from 'app/services/common/models/seller-question.service';
import {
  AnswerMessage,
  SellerQuestion,
} from 'app/services/common/models/seller-question';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuestionService } from 'app/services/common/models/question.service';
import { Question } from 'app/services/common/models/question.model';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ConvertEngPipe],
  providers: [ConvertEngPipe],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit {
  private readonly sellerQuestionService = inject(SellerQuestionService);
  private readonly prdQuestionService = inject(QuestionService);
  private readonly fb = inject(FormBuilder);
  private readonly activroute = inject(ActivatedRoute);
  private readonly route = inject(Router);
  private readonly convertEng = inject(ConvertEngPipe);
  constructor() {
    this.sentMessage = this.fb.group({
      id: [null, [(Validators.required, Validators.minLength(10))]],
      message: this.fb.group({
        text: [null, [Validators.required, Validators.minLength(15)]],
        owner: [false, [Validators.required]],
      }),
    });
  }
  async ngOnInit(): Promise<void> {
    this.activroute.queryParams.subscribe((p) => {
      p.filter == 'seller-question'
        ? (this.filterRoute = true)
        : (this.filterRoute = false);
    });
    if (this.filterRoute) {
      await this.GetQuestionDetailsByNo();
    } else {
      await this.getProductQuestions();
    }
  }
  sellerQuestions: SellerQuestion[];
  prdQuestions: Question[];
  sentMessage: FormGroup;
  filterRoute: boolean;
  prdquestionId: string;
  async GetQuestionDetailsByNo() {
    this.activroute.params.subscribe(async (a) => {
      await this.sellerQuestionService
        .GetQuestionDetailsByNo(a.id)
        .then(async (a) => {
          this.sellerQuestions = a.questionDetails;
          if (!this.sellerQuestions[0]?.seen) {
            await this.sellerQuestionService.seenQuestion(
              this.sellerQuestions[0].id
            );
          }
        });
    });
  }
  async getProductQuestions() {
    this.activroute.params.subscribe(async (a) => {
      await this.prdQuestionService
        .getQuestionDetailsByUser(
          a.id,
          JSON.parse(localStorage.getItem('customer'))?.id,
          0,
          10
        )
        .then(async (r) => {
          this.prdQuestions = r.questions;
          if (!r.questions[0].seen) {
            await this.prdQuestionService.seenQuestion(a.id);
          }
        });
    });
  }
  async sendMessage(m: AnswerMessage) {
    m.id = this.sellerQuestions[0].id;
    await this.sellerQuestionService.answerQuestion(m).then(async (a) => {
      if (a.isSucceeded) {
        this.sentMessage.reset();
        await this.GetQuestionDetailsByNo();
      }
    });
  }
  redirectToPrdQuestion(name: string, id: string) {
    this.route.navigate([this.convertEng.transform(name) + '/sorular'], {
      queryParams: { p: id },
    });
  }
  redirectToProduct(name: string, id: string) {
    this.route.navigate([this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
}
