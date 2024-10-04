import { Injectable, inject } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { AnswerMessage, Message, SellerQuestion } from './seller-question';

@Injectable({
  providedIn: 'root',
})
export class SellerQuestionService {
  private httpClientService = inject(HttpClientService);

  async createQuestion(question: SellerQuestion, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'sellerquestion',
        action: 'CreateSellerQuestion',
      },
      question
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { isSucceeded: boolean };
  }
  async getAllSellerQuestions(): Promise<{ questions: SellerQuestion[] }> {
    const observable: Observable<{ questions: SellerQuestion[] }> =
      this.httpClientService.get({
        controller: 'sellerquestion',
        action: 'GetAllQuestions',
      });
    return await firstValueFrom(observable);
  }
  async GetQuestionDetailsByNo(
    ticketNo: string
  ): Promise<{ questionDetails: SellerQuestion[] }> {
    const observable: Observable<{ questionDetails: SellerQuestion[] }> =
      this.httpClientService.get(
        {
          controller: 'sellerquestion',
          action: 'GetQuestionDetailsByNo',
        },
        ticketNo
      );
    return await firstValueFrom(observable);
  }
  async answerQuestion(
    message: AnswerMessage,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'sellerquestion',
        action: 'AnswerQuestion',
      },
      message
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async seenQuestion(
    id: string,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'sellerquestion',
        action: 'UpdateSeenQuestion',
      },
      { id: id }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async updateAnswer(
    question: SellerQuestion,
    successCallBack?: () => void
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'sellerquestion',
        action: 'UpdateAnswer',
      },
      { question: question }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
}
