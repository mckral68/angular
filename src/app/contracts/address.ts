export class UserAddress {
  name: string;
  firstname: string;
  lastname: string;
  phone: string;
  neighbourhood: string;
  street: string;
  district: string;
  city: string;
  addressDetails: string;
  userId: string
}
export class Address {
  id: string;
  name: string;
  cityName: string;
  districts: AdresModel[]
  neighbourHoods: []
}
export class AdresModel {
  id: string
  name: string[]
}
export class UserAddressDetails {
  id: string
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  neighbourhood: Neighbourhood;
  street: string;
  district: District;
  city: City;
  addressDetails: string;
  userId: string
}
export class Neighbourhood {
  id: string
  name: string
  districtId: string
}
export class District {
  id: string
  name: string
  cityId: string
}
export class City {
  id: string
  name: string
}
