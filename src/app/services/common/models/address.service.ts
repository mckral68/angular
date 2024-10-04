import { AdresModel, UserAddress, UserAddressDetails } from './../../../contracts/address';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { PromiseFeedback } from 'app/contracts/users/promiseFeedback';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    constructor(private httpClientService: HttpClientService) { }

    async getUserAddress(UserId: string) {
        const observable: Observable<{ addresses: UserAddressDetails[] }> = this.httpClientService.get<{ addresses: UserAddressDetails[] }>({
            controller: "Address"
        }, UserId);
        return await firstValueFrom(observable);
    }
    async getCities() {
        const observable: Observable<{ cities: AdresModel[] }> = this.httpClientService.get<{ cities: AdresModel[] }>({
            controller: "Cities"
        });
        return await firstValueFrom(observable);
    }
    async getDistricts(cityId: string) {
        const observable: Observable<{ districts: AdresModel[] }> = this.httpClientService.get<{ districts: AdresModel[] }>({
            controller: "Districts"
        }, cityId);
        return await firstValueFrom(observable);
    }
    async getNeighbourhoods(districtId: string) {
        const observable: Observable<{ neighbourHoods: AdresModel[] }> = this.httpClientService.get<{ neighbourHoods: AdresModel[] }>({
            controller: "Neighbourhoods"
        }, districtId);
        return await firstValueFrom(observable);
    }
    async create(address: UserAddress): Promise<PromiseFeedback> {
        const observable: Observable<UserAddress | PromiseFeedback> = this.httpClientService.post<UserAddress>({
            controller: "Address",
            action: "CreateUserAddress"
        },
            address
        );
        return await firstValueFrom(observable) as PromiseFeedback;
    }
    async update(user: UserAddress): Promise<PromiseFeedback> {
        const observable: Observable<UserAddress | PromiseFeedback> = this.httpClientService.put<UserAddress>({
            controller: "Address",
            action: "UserUpdateAddress"
        }, user);

        return await firstValueFrom(observable) as PromiseFeedback;
    }
    async remove(id: string): Promise<void> {
        const observable: Observable<any> = this.httpClientService.delete({
          controller: "address",
        }, id)
        await firstValueFrom(observable);
      }
}
