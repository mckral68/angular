import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import {
  AllProductComment,
  EditComment,
  GetCommentsByUserId,
  ProductComment,
} from 'app/contracts/create_product';
import { CreatePrdComment, EditPrdComment } from 'app/contracts/simpleProduct';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private httpClientService: HttpClientService) {}

  async getPrdComment(prdId: string, successCallBack?: () => void) {
    const observable: Observable<{ comment: ProductComment[] }> =
      this.httpClientService.get<{ comment: ProductComment[] }>(
        {
          controller: 'comment',
          action: 'GetProductComment',
        },
        prdId
      );
    return await firstValueFrom(observable);
  }
  async getCommentById(Id: string, successCallBack?: () => void) {
    const observable: Observable<{ comment: EditComment[] }> =
      this.httpClientService.get<{ comment: EditComment[] }>(
        {
          controller: 'comment',
          action: 'GetCommentById',
        },
        Id
      );
    return await firstValueFrom(observable);
  }
  async getCommentsByUserId(userId: string, successCallBack?: () => void) {
    const observable: Observable<{ comment: GetCommentsByUserId[] }> =
      this.httpClientService.get<{ comment: GetCommentsByUserId[] }>(
        {
          controller: 'comment',
          action: 'GetCommentsByUserId',
        },
        userId
      );
    return await firstValueFrom(observable);
  }
  async getReviewableComment(userId: string, successCallBack?: () => void) {
    const observable: Observable<{
      reviewableComments: [];
      approvedComments: any;
      rejectComments: any;
    }> = this.httpClientService.get<{
      reviewableComments: [];
      approvedComments: any;
      rejectComments: any;
    }>(
      {
        controller: 'comment',
        action: 'ReviewableComment',
      },
      userId
    );
    return await firstValueFrom(observable);
  }
  async getAllPrdComment(
    page: number,
    size: number,
    successCallBack?: () => void
  ) {
    const observable: Observable<{ comments: AllProductComment[] }> =
      this.httpClientService.get<{ comments: AllProductComment[] }>({
        controller: 'comment',
        action: 'GetAllProductComment',
        queryString: `page=${page}&size=${size}`,
      });
    return await firstValueFrom(observable);
  }
  async approvalComment(
    commentId: string,
    isApproval: boolean,
    successCallBack?: () => void
  ) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'comment',
        action: 'ApprovalProductComment',
      },
      { commentId, isApproval }
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { succeded: boolean };
  }
    async removeComment(
    id: string,
  ): Promise<{ isSucceeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'comment',
      },
      id
    );

    return await firstValueFrom(observable);
  }
  async updatePrdComment(comment: EditPrdComment) {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'Comment',
      },
      {
        id: comment.id,
        content: comment.content,
        rankScore: comment.rateScore,
        isNameShow: comment.isNameShow,
      }
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { message: string; succeeded: boolean };
  }

  async createPrdComment(
    prdComment: CreatePrdComment,
    successCallBack?: () => void
  ) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        action: 'CreatePrdComment',
        controller: 'Comment',
      },
      prdComment
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { succeeded: boolean };
  }
}
