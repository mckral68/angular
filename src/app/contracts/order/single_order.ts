import { UserAddressDetails } from "../address";

export class SingleOrder {
  address: UserAddressDetails;
  orderItems: any[];
  createdDate: Date;
  description: string;
  id: string;
  size: string
  color: string
  orderNumber: string;
  completed: boolean;
  totalPrice: number;
}
