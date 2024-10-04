import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from 'app/services/common/models/question.service';
import { Question } from 'app/services/common/models/question.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { UserAuthService } from 'app/services/common/models/user-auth.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  private questionService = inject(QuestionService);
  private activatedRoute = inject(ActivatedRoute);
  private userAuthService = inject(UserAuthService);
  private customToastrService = inject(CustomToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  constructor() {
    this.activatedRoute.queryParams.subscribe((a) => (this.productId = a.p));
    this.questionForm = this.fb.group({
      productId: [
        this.productId,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
      userId: [null],
      showUserName: [false, [Validators.required]],
      text: [
        null,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(80),
        ],
      ],
    });
  }
  questionForm: FormGroup;
  questions: Question[] = [];
  productId: string;
  isAuthenticated: boolean = false;
  page: number = 0;
  isQuestionLast: boolean = false;
  async ngOnInit(): Promise<void> {
    await this.getQuestionByProduct();
    this.isAuthenticated = await this.userAuthService.identityCheck();
    !this.isAuthenticated
      ? this.questionForm.get('text').disable()
      : this.questionForm.get('text').enable();
  }
  async getQuestionByProduct() {
    await this.questionService
      .getQuestionByProduct(this.productId, 0, 4)
      .then((q) => {
        this.isQuestionLast = q.latest;
        this.questions = q.questions;
      });
  }
  redirectBack() {
    this.activatedRoute.params.subscribe((a) =>
      this.router.navigate(['/' + a.name], {
        queryParams: { p: this.productId },
      })
    );
  }
  async addQuestion(question: Question) {
    question.userId = JSON.parse(localStorage.getItem('customer'))?.id;
    if (this.questionForm.valid) {
      this.questionService.createQuestion(question).then((a) => {
        if (a.isSucceeded) {
          this.customToastrService.message(
            'Sorunuz başarıyla satıcıya iletilmiştir.',
            'Başarılı',
            {
              messageType: ToastrMessageType.Info,
              position: ToastrPosition.TopFullWidth,
            }
          );
          this.questionForm.reset();
        }
      });
    }
  }
  async getNextQuestions() {
    this.page += 1;
    await this.questionService
      .getQuestionByProduct(this.productId, this.page, 4)
      .then((a) => {
        this.questions.push(...a.questions);
        this.isQuestionLast = a.latest;
      });
  }
  redirectToLogin() {
    this.router.navigate(['giris'], {
      queryParams: {
        returnUrl: `${
          this.activatedRoute.snapshot.params.name + '/sorular'
        }?p=${this.activatedRoute.snapshot.queryParams.p}`,
      },
    });
  }
}
