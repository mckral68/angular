import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
export interface BreadcrumbItem {
  label: string; // Breadcrumb metni
  link?: string; // Link (opsiyonel)
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = []; // Dinamik breadcrumb öğeleri
}
