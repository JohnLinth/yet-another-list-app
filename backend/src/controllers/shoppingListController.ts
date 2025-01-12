import { Request, Response } from "express";
import ShoppingList from "../models/ShoppingList";
import { asyncWrapper } from "../utils/asyncWrapper";
import ShoppingItem from "../models/ShoppingItem";
import sanitizeHtml from "sanitize-html";

// helper function for sanitizing input
const sanitizeInput = (input: string) =>
    sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

// create a new shopping list
export const createShoppingList = asyncWrapper(async (req: Request, res: Response) => {
    let { name, description, items } = req.body;

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

    // validate items
    if (!Array.isArray(items)) {
        errors.push("Items must be an array.");
    } else {
        items.forEach((item: any, index: number) => {
            if (!item.item) errors.push(`Item at index ${index} is missing 'item'.`);
            if (typeof item.quantity !== "number" || item.quantity <= 0) {
                errors.push(`Item at index ${index} must have a valid 'quantity' greater than 0.`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const formattedItems = items.map((item: any) => ({
        item: item.item,
        quantity: item.quantity,
        status: item.status || "not purchased",
    }));

    const newList = new ShoppingList({ name, description, items: formattedItems });
    const savedList = await newList.save();
    res.status(201).json(savedList);
});

// get all shopping lists with search, filter, and sort functionality
export const getAllShoppingLists = asyncWrapper(async (req: Request, res: Response) => {
    const { filter, search, sortBy, order, limit, page } = req.query;

    const limitValue = parseInt(limit as string) || 20;
    const pageValue = parseInt(page as string) || 1;
    const skip = (pageValue - 1) * limitValue;

    let query: any = {};
    let itemIds: string[] = [];

    // filter logic
    if (filter && search) {
        const searchRegex = new RegExp(search as string, "i"); // case-insensitive regex

        if (filter === "item") {
            // find items matching the search query
            const items = await ShoppingItem.find({ name: searchRegex });

            if (items.length === 0) {
                // no matching items, return empty results
                return res.status(200).json({
                    lists: [],
                    totalLists: 0,
                    currentPage: pageValue,
                    totalPages: 0,
                });
            }

            // get matching item IDs
            itemIds = items.map((item: any) => item._id.toString());
            query["items.item"] = { $in: itemIds }; // match lists containing these item IDs
        } else if (filter === "name") {
            // filter by shopping list name
            query.name = searchRegex;
        } else if (filter === "description") {
            // filter by shopping list description
            query.description = searchRegex;
        }
    }

    // sorting options
    const sortOptions: any = {};
    if (sortBy && ["name", "createdAt"].includes(sortBy as string)) {
        sortOptions[sortBy as string] = order === "desc" ? -1 : 1;
    }

    // fetch filtered, sorted, and paginated shopping lists
    const lists = await ShoppingList.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue)
        .populate("items.item"); // Populate item details

    // get total count of matching lists for pagination
    const totalLists = await ShoppingList.countDocuments(query);

    res.status(200).json({
        lists,
        totalLists,
        currentPage: pageValue,
        totalPages: Math.ceil(totalLists / limitValue),
    });
});

// get a specific shopping list by ID
export const getShoppingListById = asyncWrapper(async (req: Request, res: Response) => {
    const list = await ShoppingList.findById(req.params.id).populate("items.item");
    if (!list) return res.status(404).json({ message: "Shopping list not found" });
    res.json(list);
});

// update a shopping list
export const updateShoppingList = asyncWrapper(async (req: Request, res: Response) => {
    let { name, description, items } = req.body;

    const errors: string[] = [];

    // validate and sanitize name
    if (name) {
        if (typeof name !== "string" || name.trim() === "") {
            errors.push("Name must be a non-empty string.");
        } else if (name.length > 50) {
            errors.push("Name must not exceed 50 characters.");
        } else {
            name = sanitizeInput(name);
        }
    }

    // validate and sanitize description
    if (description) {
        if (typeof description !== "string") {
            errors.push("Description must be a string.");
        } else if (description.length > 255) {
            errors.push("Description must not exceed 255 characters.");
        } else {
            description = sanitizeInput(description);
        }
    }

    // validate items
    if (items) {
        if (!Array.isArray(items)) {
            errors.push("Items must be an array.");
        } else {
            items.forEach((item: any, index: number) => {
                if (!item.item) errors.push(`Item at index ${index} is missing 'item'.`);
                if (typeof item.quantity !== "number" || item.quantity <= 0) {
                    errors.push(`Item at index ${index} must have a valid 'quantity' greater than 0.`);
                }
            });
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const updatedList = await ShoppingList.findByIdAndUpdate(
        req.params.id,
        { name, description, items },
        { new: true }
    ).populate("items.item");

    if (!updatedList) return res.status(404).json({ message: "Shopping list not found" });
    res.json(updatedList);
});

// delete a shopping list
export const deleteShoppingList = asyncWrapper(async (req: Request, res: Response) => {
    const deletedList = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!deletedList) return res.status(404).json({ message: "Shopping list not found" });
    res.json({ message: "Shopping list deleted" });
});
