import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private formFieldsSubject = new BehaviorSubject<object[]>([]);
  formFields$ = this.formFieldsSubject.asObservable();

  updateFormFields(fields: any[]) {
    this.formFieldsSubject.next(fields);
  }
}
