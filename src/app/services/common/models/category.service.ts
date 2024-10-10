import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private httpClientService = inject(HttpClientService);

  async create(category: Category, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'category',
        action: 'CreateCategory',
        queryString: `pid=${category.pid}&name=${category.name} `,
      },
      category.file
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { succeeded: boolean };
  }
  async getAllCategories(
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ data: Category[] }> {
    const observable: Observable<{ data: Category[] }> =
      this.httpClientService.get({
        controller: 'category',
        action: 'getAllCats',
      });
    return await firstValueFrom(observable);
  }
  async update(id: string, name: string, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'category',
      },
      {
        category: {
          id,
          name,
        },
      }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { succeeded: boolean };
  }
  async remove(id: string): Promise<void> {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'category',
      },
      id
    );
    await firstValueFrom(observable);
  }
}
