import {
  UserAddress,
  AdresModel,
  UserAddressDetails,
} from './../../../../contracts/address';
import { AddressService } from './../../../../services/common/models/address.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasketService } from 'app/services/common/models/basket.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'app/services/ui/custom-toastr.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
})
export class UserAddressComponent implements OnInit {
  prevUrl: string;
  userAddress: FormGroup;
  constructor(
    private fb: FormBuilder,
    private customToastr: CustomToastrService,
    private basketService: BasketService,
    private addressService: AddressService
  ) {
    this.getUserAdresForm();
  }
  getUserAdresForm() {
    this.userAddress = this.fb.group({
      Name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      firstname: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      Lastname: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32),
        ],
      ],
      Phone: [
        null,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      City: [null, [Validators.required]],
      District: [null, [Validators.required]],
      Id: [null],
      NeighbourhoodId: [null, [Validators.required, Validators.minLength(1)]],
      Street: [null, [Validators.required]],
      AddressDetails: [null, [Validators.required]],
    });
  }
  pc(event: any) {
    this.userAddress.controls['Phone'].setValue('05');
  }
  total: number;
  async ngOnInit(): Promise<void> {
    this.basketService.prevUrl.subscribe((url) => (this.prevUrl = url));
    await this.getCity();
    await this.getUserAddress();
  }
  area_code: string[] = ['+90', '+49', '+1', '+43'];
  city: AdresModel[];
  districts: AdresModel[] = [];
  neighbourHouds: AdresModel[] = [];
  cityIndex: number = 0;
  editable: boolean = false;
  isClick: boolean = false;
  phoneDelete: boolean = false;
  userAddressDetails: UserAddressDetails[];
  districtName: string;
  neighName: string;
  ilce: string;
  check() {
    this.isClick = !this.isClick;
  }
  async eventHandler(event: any): Promise<void> {
    if (
      event.target?.value?.length == 3 &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.phoneDelete = true;
    }
    this.phoneDelete = false;
  }
  async getDistrict(event: any): Promise<AdresModel[]> {
    this.editable = true;
    this.districts = [];
    this.neighbourHouds = [];
    return await this.addressService
      .getDistricts(event.target.value)
      .then((a) => (this.districts = a.districts));
  }
  async getNeighbourHood(event: any): Promise<AdresModel[]> {
    this.editable = true;
    return await this.addressService
      .getNeighbourhoods(event.target.value)
      .then((a) => (this.neighbourHouds = a.neighbourHoods));
  }
  async getCity() {
    this.city = (await this.addressService.getCities()).cities;
  }
  async getUserAddress() {
    this.addressService
      .getUserAddress(JSON.parse(localStorage.getItem('customer'))['id'])
      .then((a) => (this.userAddressDetails = a.addresses));
  }
  async getUserAdresInfo(i: number) {
    this.editable = false;
    await this.addressService
      .getDistricts(this.userAddressDetails[i].district.cityId)
      .then((a) => (this.districts = a.districts));
    await this.addressService
      .getNeighbourhoods(this.userAddressDetails[i].neighbourhood.districtId)
      .then((a) => (this.neighbourHouds = a.neighbourHoods));
    this.userAddress.controls['Name'].setValue(this.userAddressDetails[i].name);
    this.userAddress.controls['firstname'].setValue(
      this.userAddressDetails[i].firstName
    );
    this.userAddress.controls['Lastname'].setValue(
      this.userAddressDetails[i].lastName
    );
    this.userAddress.controls['Phone'].setValue(
      this.userAddressDetails[i].phone
    );
    this.userAddress.controls['City'].setValue(this.userAddressDetails[i].city);
    this.userAddress.controls['District'].setValue(
      this.userAddressDetails[i].district
    );
    this.userAddress.controls['NeighbourhoodId'].setValue(
      this.userAddressDetails[i].neighbourhood.id
    );
    this.userAddress.controls['Street'].setValue(
      this.userAddressDetails[i].street
    );
    this.userAddress.controls['AddressDetails'].setValue(
      this.userAddressDetails[i].addressDetails
    );
    this.userAddress.controls['Id'].setValue(this.userAddressDetails[i].id);

    this.isClick = false;
  }
  async addAddress(address: UserAddress) {
    address.userId = JSON.parse(localStorage.getItem('customer'))['id'];
    if (
      this.userAddress.pristine ||
      this.userAddress.invalid ||
      !this.userAddress.dirty
    ) {
      this.customToastr.message(
        'Hata Alındı',
        'Lütfen formu eksiksiz doldurunuz.',
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.BottomRight,
        }
      );
      return;
    }
    await this.addressService
      .create(address)
      .then((res) =>
        this.customToastr.message(res.message, 'Yeni Adresiniz Eklendi', {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.BottomRight,
        })
      )
      .then(async (a) => await this.getUserAddress());
  }
  async updateAddress(address: UserAddress) {
    address.userId = JSON.parse(localStorage.getItem('customer'))['id'];
    if (
      this.userAddress.pristine ||
      this.userAddress.invalid ||
      !this.userAddress.dirty
    ) {
      this.customToastr.message(
        'Lütfen formu eksiksiz doldurunuz!',
        'Hata oluştu',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight,
        }
      );
      await this.clear();
      return;
    }
    await this.addressService
      .update(address)
      .then((res) =>
        this.customToastr.message(res.message, 'Adresiniz Güncellendi', {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.BottomRight,
        })
      )
      .then(async (a) => await this.getUserAddress())
      .then((a) => this.clear());
  }
  async removeAddress(id: string) {
    await this.addressService
      .remove(id)
      .then((res) =>
        this.customToastr.message('Adres Silindi', 'Başarılı', {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.BottomRight,
        })
      )
      .then(async (a) => await this.getUserAddress());
  }
  async clear() {
    this.userAddress.reset();
    this.districts = [];
    this.neighbourHouds = [];
  }
}
