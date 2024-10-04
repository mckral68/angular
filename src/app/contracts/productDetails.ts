import { Categories } from './simpleProduct';
import { Attribute, AttributeValue } from './variable_option.model';

export class ProductDetailsModel {
  name: string;
  description: string;
  discountAvaliable: boolean;
  price: number;
  id: string;
  isAvaliable: boolean;
  catName: Categories[];
  attributes: Attribute[];
  values: AttributeValue[];
}
