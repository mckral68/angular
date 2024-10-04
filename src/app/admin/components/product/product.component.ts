import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Attribute {
  attributeID: number;
  name: string;
}

interface AttributeValue {
  attributeValueID: number;
  attributeID: number;
  value: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  attributes$: Observable<Attribute[]>;
  attributeValues$: Observable<AttributeValue[]>;
  selectedAttributes: { [key: number]: number } = {};
  stock: { attributeId: number; quantity: number }[] = [];
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      attributes: this.fb.group({}),
      stock: this.fb.group({}),
    });
  }

  ngOnInit(): void {
    this.attributes$ = this.http.get<Attribute[]>('/api/attributes');
    this.attributeValues$ = this.http.get<AttributeValue[]>(
      '/api/attribute-values'
    );

    this.attributes$.subscribe((attributes) => {
      const attributesFormGroup = this.productForm.get(
        'attributes'
      ) as FormGroup;
      attributes.forEach((attr) => {
        attributesFormGroup.addControl(
          attr.attributeID.toString(),
          this.fb.control('')
        );
      });
    });
  }

  onAttributeChange(attributeID: number, valueID: number): void {
    this.selectedAttributes[attributeID] = valueID;
  }

  onStockChange(attributeID: number, quantity: number): void {
    const index = this.stock.findIndex(
      (item) => item.attributeId === attributeID
    );
    if (index >= 0) {
      this.stock[index].quantity = quantity;
    } else {
      this.stock.push({ attributeId: attributeID, quantity });
    }
  }

  onSubmit(): void {
    const productData = {
      name: this.productForm.get('name')?.value,
      attributes: Object.keys(this.selectedAttributes).map((attributeID) => ({
        attributeId: +attributeID,
        attributeValueId: this.selectedAttributes[+attributeID],
      })),
      stock: this.stock,
    };

    this.http.post('/api/products', productData).subscribe({
      next: () => alert('Product added successfully!'),
      error: (err) => console.error('Error adding product:', err),
    });
  }
}
