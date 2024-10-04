import { SessionVarOptions } from './SessionVarOptions';
import { Categories } from './simpleProduct';
import { List_Product_Image } from "./list_product_image";

export class List_Product {
  id: string;
  name: string;
  description: string;
  kategoriAdlari: Categories[];
  price: number;
  createdDate: Date;
  updatedDate: Date;
  productImageFiles?: List_Product_Image[];
  imagePath: string;
  variationOptions: SessionVarOptions[]
}


