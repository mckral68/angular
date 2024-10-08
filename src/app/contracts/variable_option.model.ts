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
  value: string;
}
