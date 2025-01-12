  import { Schema, model, Document } from "mongoose";

  // example shopping item:
  // {
  //   name: "Apple",
  //   description: "A fresh apple",
  //   price: 0.5,
  // }

  // define the interface for the shopping item
  interface IShoppingItem extends Document {
    name: string; // 50 characters max 
    description: string; // 255 characters max
    price: number; // price in EURO
  }

  // create the schema for the shopping item
  const shoppingItemSchema = new Schema<IShoppingItem>({
    name: { type: String, required: true }, 
    description: { type: String, required: true },
    price: { type: Number, required: true },
  });

  // use "ShoppingItem" as the model name
  const ShoppingItem = model<IShoppingItem>("items", shoppingItemSchema);

  export default ShoppingItem;
