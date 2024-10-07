import { SessionVarOptions } from './SessionVarOptions';
import { Categories, Stock } from './simpleProduct';

export class Create_Product {
  name: string;
  description: string;
  catName?: string;
  categoryId: string;
  isHome: boolean;
  status: boolean;
  regularPrice: number;
  salePrice: number;
  isStock: boolean;
  variations: SessionVarOptions[];
}
export class Create_Favorite {
  productId: string;
  userId: string;
}
export class Get_Favorite {
  id: string;
  count: number;
  isFavorite: boolean;
}
export class Favorite_List {
  prdId: string;
  favId: string;
  name: string;
  price: number;
  productImageFiles: List_Product_Image[];
}
export class Edit_Product {
  id: string;
  name: string;
  description: string;
  categoryIds: Categories[];
  attributes: Stock[];
  totalStock: number;
  isHome: boolean;
  isDiscounted: boolean;
  price: number;
  variation_Option: SessionVarOptions[];
}
export class ReadImages {
  id: string;
  attributeValueId: string;
}
export class AttributeValue {
  name: string;
  value: string;
  variation: Attribute;
}
export class Attribute {
  value: string;
  id: string;
}

export class List_Product_Image {
  fileName: string;
  path: string;
  id: string;
  showcase: boolean;
}

export class ProductComment {
  content: string;
  createdDate: string;
  isNameShow: boolean;
  dislikeCount: number;
  firstName: string;
  lastName: string;
  likeCount: number;
  rankScore: number;
}
export class EditComment {
  content: string;
  name: string;
  path: {
    path: string;
  };
  isNameShow: boolean;
  rankScore: string;
}

export class GetCommentsByUserId {
  id: string;
  prdId: string;
  content: string;
  name: string;
  rankScore: number;
  isApproved: boolean;
  path: string;
}
export class AllProductComment {
  firstName: string;
  lastName: string;
  content: string;
  rankScore: number;
  name: string;
  createdDate: Date;
  isApproved: boolean;
  isAdminAssessment: boolean;
  id: string;
}
