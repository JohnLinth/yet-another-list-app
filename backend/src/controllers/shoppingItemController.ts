import { Request, Response } from "express";
import ShoppingItem from "../models/ShoppingItem";
import ShoppingList from "../models/ShoppingList";
import { asyncWrapper } from "../utils/asyncWrapper";
import sanitizeHtml from "sanitize-html";

// helper function for sanitizing input
const sanitizeInput = (input: string) =>
    sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

// create a new shopping item
export const createShoppingItem = asyncWrapper(async (req: Request, res: Response) => {
    let { name, description, price } = req.body;

    const errors: string[] = [];

    // validate and sanitize name
    if (!name || typeof name !== "string" || name.trim() === "") {
        errors.push("Name is required and must be a non-empty string.");
    } else if (name.length > 50) {
        errors.push("Name must not exceed 50 characters.");
    } else {
        name = sanitizeInput(name);
    }

    // validate and sanitize description
    if (description && typeof description === "string") {
        if (description.length > 255) {
            errors.push("Description must not exceed 255 characters.");
        } else {
            description = sanitizeInput(description);
        }
    }

    // validate price
    if (price == null || typeof price !== "number" || price <= 0) {
        errors.push("Price is required and must be a positive number.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const newItem = new ShoppingItem({ name, description, price });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
});

// get all shopping items
export const getAllShoppingItems = asyncWrapper(async (req: Request, res: Response) => {
    const { sortBy, order, filter, search, limit, page } = req.query;

    const limitValue = parseInt(limit as string) || 20;
    const pageValue = parseInt(page as string) || 1;
    const skip = (pageValue - 1) * limitValue;

    // build the query object
    let query: any = {};
    if (filter && search) {
        query[filter as string] = { $regex: search as string, $options: "i" };
    }

    // define sort options
    let sortOptions: any = {};
    if (sortBy && ["name", "price", "description"].includes(sortBy as string)) {
        sortOptions[sortBy as string] = order === "desc" ? -1 : 1;
    }

    // fetch paginated and sorted items with collation for case-insensitive sorting
    const items = await ShoppingItem.find(query)
        .collation({ locale: "en", strength: 2 }) // case-insensitive sorting
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue);

    // get total item count for pagination info
    const totalItems = await ShoppingItem.countDocuments(query);

    res.status(200).json({
        items,
        totalItems,
        currentPage: pageValue,
        totalPages: Math.ceil(totalItems / limitValue),
    });
});

// get a specific shopping item by ID
export const getShoppingItemById = asyncWrapper(async (req: Request, res: Response) => {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
});

// update a shopping item
export const updateShoppingItem = asyncWrapper(async (req: Request, res: Response) => {
    let { name, description, price } = req.body;

    const errors: string[] = [];

    // validate and sanitize name
    if (name) {
        if (typeof name !== "string" || name.trim() === "") {
            errors.push("Name must be a non-empty string if provided.");
        } else if (name.length > 50) {
            errors.push("Name must not exceed 50 characters.");
        } else {
            name = sanitizeInput(name);
        }
    }

    // validate and sanitize description
    if (description) {
        if (typeof description !== "string") {
            errors.push("Description must be a string if provided.");
        } else if (description.length > 255) {
            errors.push("Description must not exceed 255 characters.");
        } else {
            description = sanitizeInput(description);
        }
    }

    // validate price
    if (price != null && (typeof price !== "number" || price <= 0)) {
        errors.push("Price must be a positive number if provided.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const updatedItem = await ShoppingItem.findByIdAndUpdate(
        req.params.id,
        { name, description, price },
        { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
});

// delete a shopping item
export const deleteShoppingItem = asyncWrapper(async (req: Request, res: Response) => {
    const deletedItem = await ShoppingItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    // remove the item from all shopping lists
    await ShoppingList.updateMany(
        { "items.item": req.params.id }, // match lists containing the item
        { $pull: { items: { item: req.params.id } } } // Remove the item
    );

    res.json({ message: "Item deleted and removed from all shopping lists" });
});