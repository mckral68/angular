import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService } from 'app/services/common/models/subject.service';
import { Subject } from 'app/services/common/models/subject.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private fb = inject(FormBuilder);
  private toastrService = inject(CustomToastrService);
  constructor() {
    this.subjectForm = this.fb.group({
      id: [null],
      name: [null, [Validators.minLength(2), Validators.maxLength(40)]],
    });
  }
  async ngOnInit(): Promise<void> {
    await this.getAllSubjects();
  }
  subjects: Subject[];
  updMode: boolean = false;
  openAnswer: boolean = false;
  subjectForm: FormGroup;
  async getAllSubjects() {
    await this.subjectService.getAllSubjects().then((a) => {
      this.subjects = a.subjects;
    });
  }
  async createSubject(name: string) {
    await this.subjectService.createSubject(name).then(async (a) => {
      if (a.succeeded) {
        this.subjectForm.reset()
      }
      await this.getAllSubjects();
    });
  }
  async updateSubject(name: string) {
    await this.subjectService.updateSubject(name).then((a) => {
      if (a.succeeded) {
        this.toastrService.message('Başarıyla güncellenedi', 'Başarılı', {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopFullWidth,
        });
      }
    });
  }
  editAnswer(q: Subject) {
    this.subjectForm.patchValue({
      id: q.id,
      name: q.name,
    });
    this.updMode = true;
    this.openAnswer = true;
    window.scrollTo(0, 0);
  }
  async removeSubject(id: string) {
    await this.subjectService.remove(id).then((a) => {
      if (a.succeeded) {
        this.subjectService.getAllSubjects().then((answers) => {
          this.subjects = answers.subjects;
        });
      }
    });
  }
}
