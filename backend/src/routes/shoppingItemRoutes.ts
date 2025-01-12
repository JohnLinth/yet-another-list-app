import { Router } from "express";

import {
    createShoppingItem,
    getAllShoppingItems,
    getShoppingItemById,
    updateShoppingItem,
    deleteShoppingItem,
} from "../controllers/shoppingItemController";

const router = Router();

router.post("/", createShoppingItem);
router.get("/", getAllShoppingItems);
router.get("/:id", getShoppingItemById);
router.put("/:id", updateShoppingItem);
router.delete("/:id", deleteShoppingItem);
export default router;
