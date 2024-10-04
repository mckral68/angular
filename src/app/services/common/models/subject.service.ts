import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { Subject } from './subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private httpClientService = inject(HttpClientService);
  constructor() {}
  async createSubject(name: string, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        controller: 'subjects',
        action: 'CreateSubject',
      },
      name
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { succeeded: boolean };
  }
  async updateSubject(
    name: string,
    successCallBack?: () => void
  ): Promise<{ succeeded: boolean }> {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'subjects',
      },
      name
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return await promiseData;
  }
  async remove(id: string): Promise<{ succeeded: boolean }> {
    const observable: Observable<{ succeeded: boolean }> =
      this.httpClientService.delete(
        {
          controller: 'subjects',
        },
        id
      );
    return firstValueFrom(observable);
  }
  async getAllSubjects(): Promise<{ subjects: Subject[] }> {
    const observable: Observable<{ subjects: Subject[] }> =
      this.httpClientService.get({
        controller: 'subjects',
        action: 'GetAllSubjects',
      });
    return await firstValueFrom(observable);
  }
}
