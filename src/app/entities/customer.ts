import { List_Basket_Item } from "app/contracts/basket/list_basket_item"

export class Customer {
  constructor(
    public firstName: string,
    public lastName: string,
    public accessFailedCount: number,
    public addresses: string[],
    public baskets: List_Basket_Item[],
    public comments: string[],
    public email: string,
    public emailConfirmed: boolean,
    public id: string,
    public phone: string,
    public gender: boolean,
    public birthDay: Date,
    public favoriteProducts: string[],
  ){}}
