export class Create_Order {
  addressId: string;
  payment: Payment;
  creditCart: CreditCart;
  userId: string;
  orderBasket: OrderBasket[];
  isSuccess: boolean;
  price: number;
}
export class Payment {
  type: string;
  isApproved: boolean;
}
export class OrderBasket {
  productId: string;
  colorId: string;
  sizeId: string;
  unitPrice: number;
  quantity: number;
}
export class CreditCart {
  cartno: number;
  creditCartTypeId: string;
  CreditCartMonth: number;
  CreditCartYear: number;
}
