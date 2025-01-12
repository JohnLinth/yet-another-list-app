import { Router } from "express";

import {
    createShoppingList,
    getAllShoppingLists,
    getShoppingListById,
    updateShoppingList,
    deleteShoppingList,
} from "../controllers/shoppingListController";

const router = Router();

router.post("/", createShoppingList);
router.get("/", getAllShoppingLists);
router.get("/:id", getShoppingListById);
router.put("/:id", updateShoppingList);
router.delete("/:id", deleteShoppingList);

export default router;
