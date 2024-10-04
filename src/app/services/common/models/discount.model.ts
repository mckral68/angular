export interface Discount {
  id: string;
  name: string;
  description: string;
  toAllCartItem: boolean;
  isActive: boolean;
  isExpirationDate: boolean;
  discount_type: number;
  discountAmount: number;
  maxDiscountAmount: number;
  lowerLimit: number;
  usageLimit: number;
  startDate: Date;
  expireTime: Date;
}
