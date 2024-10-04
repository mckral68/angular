import { Question } from 'app/services/common/models/question.model';
import { Component, ViewEncapsulation, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from 'app/services/common/models/question.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SellerQuestionService } from 'app/services/common/models/seller-question.service';
import {
  AnswerMessage,
  Message,
  SellerQuestion,
} from 'app/services/common/models/seller-question';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ConvertEngPipe } from '../../../../services/ui/convert-eng.pipe';

@Component({
  selector: 'app-userquestions',
  standalone: true,
  templateUrl: './userquestions.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./userquestions.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ConvertEngPipe],
  providers: [ConvertEngPipe],
})
export class UserquestionsComponent implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly sellerQuestionService = inject(SellerQuestionService);
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
    this.userId = JSON.parse(localStorage.getItem('customer'))?.id;
    await this.getUserSellerQuestions();
    await this.getUserProductQuestions();
    window.innerWidth > 1000 ? (this.isMobil = false) : (this.isMobil = true);
  }
  sentMessage: FormGroup;
  isQuestionLast: boolean;
  questions: Question[];
  sellerQuestions: SellerQuestion[];
  activeSellerQuestions: SellerQuestion;
  activePrdQuestions: Question;
  productQuestions: Question[];
  page: number = 0;
  unseenUserQuestionCount: number;
  unseenPrdQuestionCount: number;
  index: number;
  isProductsQuestions: boolean;
  messages: Message[];
  isMobil: boolean;
  private userId: string;
  async activeHandle(i: number) {
    if (i === 1) {
      this.isProductsQuestions = false;
    } else {
      this.isProductsQuestions = true;
    }
  }
  async getUserProductQuestions() {
    await this.questionService
      .getQuestionByUser(this.userId, 0, 4)
      .then((q) => {
        this.productQuestions = q.questions;
        this.unseenPrdQuestionCount = q.questions.filter(
          (u) => u.isAnswered && !u.seen
        ).length;
        this.activePrdQuestions = this.productQuestions[0];
        this.isQuestionLast = q.latest;
      });
  }
  async activeQuestion(i: number) {
    this.activeSellerQuestions = this.sellerQuestions[i];
    if (!this.activeSellerQuestions.seen) {
      await this.sellerQuestionService.seenQuestion(
        this.activeSellerQuestions.id
      );
    }
  }
  activePrdQuestion(i: number) {
    this.activePrdQuestions = this.productQuestions[i];
  }
  async getNextQuestions() {
    this.page += 1;
    await this.questionService
      .getQuestionByUser(this.userId, this.page, 4)
      .then((a) => {
        this.questions.push(...a.questions);
        this.isQuestionLast = a.latest;
      });
  }
  async getUserSellerQuestions() {
    await this.sellerQuestionService.getAllSellerQuestions().then((a) => {
      this.sellerQuestions = a.questions;
      this.activeSellerQuestions = this.sellerQuestions[0];
      this.unseenUserQuestionCount = this.sellerQuestions.filter(
        (a) => !a.seen
      ).length;
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
  async GetQuestionDetailsByNo() {
    this.activroute.params.subscribe(async (a) => {
      await this.sellerQuestionService
        .GetQuestionDetailsByNo(a.id)
        .then(async (a) => {
          this.sellerQuestions = a.questionDetails;
          if (
            this.sellerQuestions[0].isAnswered &&
            !this.sellerQuestions[0].seen
          ) {
            debugger
            await this.sellerQuestionService.seenQuestion(
              this.sellerQuestions[0].id
            );
          }
        });
    });
  }
  redirectToProduct(name: string, id: string) {
    this.route.navigate([this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
  redirectToPrdQuestion(name: string, id: string) {
    this.route.navigate([this.convertEng.transform(name) + '/sorular'], {
      queryParams: { p: id },
    });
  }
}
