import { ProductComment } from "../create_product";
import { List_Product } from "../list_product";
import { List_Product_Image } from "../list_product_image";

export class StorageBasket {
  basketItems: List_Basket_Item[]
  totalFee: number
  quantity: number
}
export class List_Basket_Item {
  basketItemId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  sku:string;
  quantity: number;
  product: List_Product
  productId: string
  colorId: string
  sizeId: string
  imagePath: List_Product_Image
}
export class PrdComment {
  id: string;
  comments: ProductComment[]
}