import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private httpClientService = inject(HttpClientService);
  constructor() {}
  async createQuestion(question: Question, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'question',
        action: 'CreateQuestion',
      },
      question
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { isSucceeded: boolean };
  }
  async answerQuestion(
    answer: string,
    id: string,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'question',
        action: 'AnswerQuestion',
      },
      { answer, id }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async updateQuestion(
    question: Question,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'question',
      },
      { question: question }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async updateAnswer(
    question: Question,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'question',
        action: 'updateAnswer',
      },
      { question: question }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async remove(id: string): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<{ isSucceeded: boolean }> =
      this.httpClientService.delete(
        {
          controller: 'question',
        },
        id
      );
    return firstValueFrom(observable);
  }
  async getQuestionByProduct(
    name: string,
    page: number,
    size: number
  ): Promise<{ questions: Question[]; latest: boolean }> {
    const observable: Observable<{ questions: Question[]; latest: boolean }> =
      this.httpClientService.get({
        controller: 'question',
        action: 'GetQuestionByProduct',
        queryString: `productId=${name}&page=${page}&size=${size}`,
      });
    return await firstValueFrom(observable);
  }
  async getAllQuestions(): Promise<{ questions: Question[] }> {
    const observable: Observable<{ questions: Question[] }> =
      this.httpClientService.get({
        controller: 'question',
      });
    return await firstValueFrom(observable);
  }
  async getQuestionByUser(
    userId: string,
    page: number,
    size: number
  ): Promise<{ questions: Question[]; latest: boolean }> {
    const observable: Observable<{ questions: Question[]; latest: boolean }> =
      this.httpClientService.get({
        controller: 'question',
        action: 'GetQuestionByUser',
        queryString: `userId=${userId}&page=${page}&size=${size}`,
      });
    return await firstValueFrom(observable);
  }
  async getQuestionDetailsByUser(
    id: string,
    userId: string,
    page: number,
    size: number
  ): Promise<{ questions: Question[]; latest: boolean }> {
    const observable: Observable<{ questions: Question[]; latest: boolean }> =
      this.httpClientService.get({
        controller: 'question',
        action: 'GetQuestionDetailsByUser',
        queryString: `id=${id}&userId=${userId}&page=${page}&size=${size}`,
      });
    return await firstValueFrom(observable);
  }
  async seenQuestion(
    id: string,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'question',
        action: 'UpdateSeenQuestion',
      },
      { id: id }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
}
