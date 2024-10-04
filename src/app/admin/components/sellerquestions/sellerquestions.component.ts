import {
  AnswerMessage,
  Message,
  SellerQuestion,
} from './../../../services/common/models/seller-question';

import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';
import { SellerQuestionService } from 'app/services/common/models/seller-question.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [ConvertEngPipe],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sellerquestions.component.html',
  styleUrls: ['./sellerquestions.component.scss'],
})
export class SellerquestionsComponent implements OnInit {
  private sellerQuestionService = inject(SellerQuestionService);
  private fb = inject(FormBuilder);
  private convertEng = inject(ConvertEngPipe);
  private router = inject(Router);
  constructor() {
    this.answerForm = this.fb.group({
      id: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      message: this.fb.group({
        text: [null, [Validators.minLength(2), Validators.maxLength(40)]],
        owner: [true, [Validators.minLength(4), Validators.maxLength(5)]],
      }),
    });
  }
  updMode: boolean = false;
  answerForm: FormGroup;
  questions: SellerQuestion[] = [];
  async ngOnInit(): Promise<void> {
    await this.sellerQuestionService.getAllSellerQuestions().then((a) => {
      this.questions = a.questions;
    });
  }

  async createAnswer(message: AnswerMessage) {
    await this.sellerQuestionService
      .answerQuestion(message)
      .then((response) => {
        if (response.isSucceeded) {
          this.answerForm.reset();
        }
      });
    await this.sellerQuestionService
      .getAllSellerQuestions()
      .then((a) => (this.questions = a.questions));
  }
  async updateAnswer(answer: SellerQuestion) {
    await this.sellerQuestionService.updateAnswer(answer);
    this.answerForm.reset();
    this.updMode = false;
    await this.sellerQuestionService
      .getAllSellerQuestions()
      .then((a) => (this.questions = a.questions));
  }
  passAnswer(id: string) {
    this.answerForm.controls['id'].setValue(id);
    window.scrollTo(0, 0);
  }
}
