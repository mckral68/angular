import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { Create_Shipment } from 'app/contracts/cargo/create_cargo';
import { GetAllShippers } from 'app/contracts/cargo/GetAllShippers';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(private httpClientService: HttpClientService) { }
  async create(shipment: Create_Shipment, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "shipment",
    }, { name: shipment.name, freight: shipment.freight });
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
    return await promiseData as { succeeded: boolean };
  }
  async getAllShipments(successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ shippers: GetAllShippers[] }> {
    const observable: Observable<{ shippers: GetAllShippers[] }> = this.httpClientService.get({
      controller: "shipment",
    });
    return await firstValueFrom(observable);;
  }
  async update(shipper: GetAllShippers) {
    const observable = this.httpClientService.put({
      controller: "shipment"
    }, {
      id: shipper.id, name: shipper.name, freight: shipper.freight
    });
    await firstValueFrom(observable);
  }
  async remove(id: string): Promise<void> {
    const observable: Observable<any> = this.httpClientService.delete({
      controller: "shipment",
    }, id)
    await firstValueFrom(observable);
  }
}
