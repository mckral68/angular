export class Attribute {
  id: string;
  name: string;
  status: boolean;
  attributeValues?: AttributeValue[];
}
export class AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  status: boolean;
  selected?: boolean;
  value: string;
}
export interface Variation {
  id?: number;
  salePrice: number;
  sku?: string;
  quantity: number;
  imageUrl?: string;
  attributeValues: AttributeValue[];
}
