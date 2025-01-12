// types are the same as in the backend 

export interface IShoppingItem {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export interface IShoppingListItem {
  _id?: string;
  item: IShoppingItem;
  quantity: number;
  status: string;
}

export interface IShoppingList {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  items: IShoppingListItem[];
}
