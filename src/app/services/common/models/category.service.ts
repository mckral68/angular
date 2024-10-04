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
      },
      { category }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { succeeded: boolean };
  }
  async getAllCategories(
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ categories: Category[] }> {
    const observable: Observable<{ categories: Category[] }> =
      this.httpClientService.get({
        controller: 'category',
        action: 'getAllCats',
      });
    return await firstValueFrom(observable);
  }
  async update(id: string, name: string) {
    const observable = this.httpClientService.put(
      {
        controller: 'category',
      },
      {
        id,
        name,
      }
    );
    await firstValueFrom(observable);
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
