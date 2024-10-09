import { Injectable } from '@angular/core';
import { BreadcrumbItem } from 'app/admin/utils/breadcrumb/breadcrumb.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private formFieldsSubject = new BehaviorSubject<object[]>([]);
  private breadCrumbItems = new BehaviorSubject<BreadcrumbItem[]>([]);
  formFields$ = this.formFieldsSubject.asObservable();
  breadCrumbItems$ = this.breadCrumbItems.asObservable();

  updateFormFields(fields: any[]) {
    this.formFieldsSubject.next(fields);
    
  }
  updatebreadCrumbItems(breadCrumbs: BreadcrumbItem[]) {
    this.breadCrumbItems.next(breadCrumbs);
  }
}
