import { MatTable, MatTableModule } from '@angular/material/table';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ShipmentService } from 'app/services/common/models/shipment.service';
import { DeleteDirective } from 'app/directives/admin/delete.directive';
import { Create_Shipment } from 'app/contracts/cargo/create_cargo';
import { GetAllShippers } from 'app/contracts/cargo/GetAllShippers';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from 'app/services/common/dialog.service';

@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    DeleteDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [DialogService],
  templateUrl: './shipment.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./shipment.component.scss'],
})
export class ShipmentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService
  ) {
    this.shipperForm = this.fb.group({
      id: [null, [Validators.minLength(2), Validators.maxLength(40)]],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
      freight: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(4)],
      ],
    });
  }
  async ngOnInit(): Promise<void> {
    await this.getAllShipments();
  }
  displayedColumns: string[] = ['adı', 'gönderim ücreti', 'process'];
  shipments: Create_Shipment[] = [];
  dataSource = [];
  shipperForm: FormGroup;
  shipValue: string;
  shipId: string;
  updMode: boolean = false;
  @ViewChild(MatTable) table: MatTable<Create_Shipment>;
  async updateData() {
    this.table.renderRows();
    await this.shipmentService.getAllShipments();
  }
  async create(shipment: Create_Shipment) {
    if (this.shipperForm.valid) {
      await this.shipmentService.create(shipment).then(async () => {
        await this.getAllShipments();
        this.shipValue = '';
      });
    } else {
      return;
    }
    this.shipperForm.reset();
  }
  async upShip(element: GetAllShippers) {
    this.shipValue = '';
    this.updMode = false;
    await this.shipmentService
      .update(element)
      .then((r) => this.getAllShipments());
    this.shipperForm.reset();
  }
  async getAllShipments() {
    await this.shipmentService
      .getAllShipments()
      .then((res) => (this.dataSource = res.shippers));
  }
  async upd(element: GetAllShippers) {
    this.updMode = true;
    this.shipperForm.controls['id'].setValue(element.id);
    this.shipperForm.controls['name'].setValue(element.name);
    this.shipperForm.controls['freight'].setValue(element.freight);
  }
}
