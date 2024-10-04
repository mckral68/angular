import { List_Product_Image } from './create_product';

export class SimpleProduct {
  id: string;
  name: string;
  productImageFiles?: List_Product_Image[];
  imagePath: string;
  kategoriAdlari: Categories[];
}

export class Categories {
  id: string;
  name: string;
}
export class Stock {
  id: string;
  name: string;
  value: string;
  stock: number;
}
export class EditPrdComment {
  id: string;
  content: string;
  email: string;
  rateScore: string;
  isNameShow: boolean;
}
export class CreatePrdComment {
  userId: string;
  content: string;
  prdId: string;
  email: string;
  rateScore: string;
  isNameShow: boolean;
}
