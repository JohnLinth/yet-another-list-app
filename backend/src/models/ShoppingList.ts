import { Schema, model, Document } from "mongoose";

// example shopping list:
// {
//   name: "Weekly Groceries",
//   description: "Items to buy for the week",
//   items: [
//     {
//       item: "Apple",
//       quantity: 5,
//       status: "not purchased",
//     },
//     {
//       item: "Banana",
//       quantity: 8,
//       status: "purchased",
//     },
//    ]
// }

// define the interface for the shopping list item relationship
interface IShoppingListItem {
  item: Schema.Types.ObjectId; // ref to the ShoppingItem
  quantity: number; 
  status: string; // e.g., 'purchased' or 'not purchased'
}

// define the interface for the shopping list
interface IShoppingList extends Document {
  name: string; // 50 characters max
  description: string; // 255 characters max
  createdAt: Date; // date created
  items: IShoppingListItem[];
}

// create the schema for the shopping list
const shoppingListSchema = new Schema<IShoppingList>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: "items", required: true }, // Reference the correct model name
      quantity: { type: Number, required: true },
      status: {
        type: String,
        enum: ["purchased", "not purchased"], // might add more statuses later (e.g., 'not available, 'out of stock')
        default: "not purchased",
      },
    },
  ],
});

// use "ShoppingList" as the model name
const ShoppingList = model<IShoppingList>("ShoppingList", shoppingListSchema);

export default ShoppingList;
