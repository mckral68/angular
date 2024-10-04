import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from 'app/services/common/models/question.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Question } from 'app/services/common/models/question.model';
import { Router, RouterModule } from '@angular/router';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [ConvertEngPipe],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  private questionService = inject(QuestionService);
  private fb = inject(FormBuilder);
  private convertEng = inject(ConvertEngPipe);
  private router = inject(Router);
  constructor() {
    this.answerForm = this.fb.group({
      id: [null],
      answer: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      text: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      productId: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      userId: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      showUserName: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      firstName: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      lastName: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      createdDate: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      isAnswered: [null, [Validators.minLength(2), Validators.maxLength(40)]],
    });
  }
  updMode: boolean = false;
  openAnswer: boolean = false;
  answerForm: FormGroup;
  questions: Question[] = [];
  questions2: Question[] = [];
  async ngOnInit(): Promise<void> {
    await this.questionService
      .getAllQuestions()
      .then((a) => (this.questions2 = a.questions));
    this.questions = this.questions2;
  }
  async createAnswer(answer: any) {
    this.questionService
      .answerQuestion(answer.answer, answer.id)
      .then(async (response) => {
        if (response.isSucceeded) {
          this.answerForm.reset();
          await this.questionService
            .getAllQuestions()
            .then((a) => (this.questions = a.questions));
        }
      });
  }
  async updateAnswer(answer: Question) {
    await this.questionService.updateAnswer(answer);
    this.answerForm.reset();
    this.updMode = false;
    this.openAnswer = false;
    await this.questionService
      .getAllQuestions()
      .then((a) => (this.questions = a.questions));
  }
  redirectPrd(name: string, id: string) {
    this.router.navigate(['/' + this.convertEng.transform(name)], {
      queryParams: { p: id },
    });
  }
  passAnswer(id: string) {
    this.answerForm.controls['id'].setValue(id);
    this.openAnswer = true;
    window.scrollTo(0, 0);
  }
  editAnswer(q: Question) {
    this.answerForm.patchValue({
      id: q.id,
      answer: q.answer,
      text: q.text,
      userId: q.userId,
      createdDate: q.createdDate,
      firstName: q.firstName,
      lastName: q.lastName,
      showUserName: q.showUserName,
      productId: q.productId,
      isAnswered: q.isAnswered,
    });
    this.updMode = true;
    this.openAnswer = true;
    window.scrollTo(0, 0);
  }
  async removeQuestion(id: string) {
    await this.questionService.remove(id).then((a) => {
      if (a.isSucceeded) {
        this.questionService.getAllQuestions().then((answers) => {
          this.questions = answers.questions;
        });
      }
    });
  }
  getWaitAnswer(e: number) {
    if (e == 0) {
      this.questions = this.questions2.filter((q) => !q.isAnswered);
    } else if (e == 1) {
      this.questions = this.questions2.filter((q) => q.isAnswered);
    } else {
      this.questions = this.questions2;
    }
  }
}
