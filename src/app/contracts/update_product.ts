import { Category } from './../services/common/models/category.model';
import { VariationOption } from './variable_option.model';


export class UpdateProduct {
  id: string;
  name: string;
  description: string;
  stock: number;
  isAvaliable: boolean;
  price: number;
  variation_option: VariationOption
  categories: Category
}
