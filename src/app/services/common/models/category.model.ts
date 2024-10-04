export interface Category {
  id?: string;
  name: string;
  no:string
  pid?: string;
  parentName:string
  status:boolean
  file:File
  updateDate?: Date;
}
