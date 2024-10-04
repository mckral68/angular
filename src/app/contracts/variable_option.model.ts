export class Attribute {
  id: string;
  name: string;
  status: boolean;
  value?: string;
}
export class AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  status: boolean;
  value: string;
}
