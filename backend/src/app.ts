import express from "express";
import cors from "cors";
import shoppingItemRoutes from "./routes/shoppingItemRoutes";
import shoppingListRoutes from "./routes/shoppingListRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

// --- middleware ---
app.use(express.json()); // parse JSON bodies
app.use(cors()); // enable CORS (important for frontend)

// --- routes ---
app.use("/item", shoppingItemRoutes);
app.use("/list", shoppingListRoutes);

// error-handling middleware (must be added after routes)
app.use(errorMiddleware);

export default app;
