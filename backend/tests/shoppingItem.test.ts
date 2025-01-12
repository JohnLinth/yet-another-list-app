import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import ShoppingItem from "../src/models/ShoppingItem";
import ShoppingList from "../src/models/ShoppingList";

// generate a unique database name for each test suite
const testDbName = `test_db_${Date.now()}`;

// set up the database for testing
beforeAll(async () => {
  const testDbUri = `mongodb://mongo:27017/${testDbName}`;
  console.log(`Connecting to test database: ${testDbName}...`);
  await mongoose.connect(testDbUri);
  console.log("Connected to test database");
});

// clean up database before each test to ensure isolation
// i was having issues with running concurrent test on the same database so i drop the db before each test
beforeEach(async () => {
  console.log("Cleaning up database...");
  
  const listResult = await ShoppingList.deleteMany({});
  const itemResult = await ShoppingItem.deleteMany({});

  console.log(`Deleted ${listResult.deletedCount} shopping lists.`);
  console.log(`Deleted ${itemResult.deletedCount} shopping items.`);

  const remainingLists = await ShoppingList.countDocuments({});
  const remainingItems = await ShoppingItem.countDocuments({});
  
  console.log(`Remaining shopping lists: ${remainingLists}`);
  console.log(`Remaining shopping items: ${remainingItems}`);

  if (remainingLists !== 0 || remainingItems !== 0) {
    throw new Error("Database cleanup failed!");
  }
});

// close the database connection after all tests
afterAll(async () => {
  console.log("Disconnecting from test database...");
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase(); // drop db
  }
  await mongoose.disconnect();
  console.log("Disconnected from test database");
});

describe("Shopping Item API Tests", () => {
  describe("POST /item", () => {
    it("should create a shopping item with valid input", async () => {
      const response = await request(app).post("/item").send({
        name: "Apple",
        description: "A fresh apple",
        price: 0.5,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Apple");
      expect(response.body).toHaveProperty("description", "A fresh apple");
      expect(response.body).toHaveProperty("price", 0.5);
    });
  });

  describe("GET /item", () => {
    it("should fetch all items with pagination", async () => {
      await ShoppingItem.create([
        { name: "Apple", description: "A fresh apple", price: 0.5 },
        { name: "Banana", description: "A ripe banana", price: 0.3 },
      ]);

      const response = await request(app).get("/item?limit=1&page=1");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.totalItems).toBe(2);
      expect(response.body.totalPages).toBe(2);
    });

    it("should return filtered items based on search criteria", async () => {
      await ShoppingItem.create({ name: "Apple", description: "A fresh apple", price: 0.5 });

      const response = await request(app).get("/item?filter=name&search=Apple");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].name).toBe("Apple");
    });
  });

  describe("GET /item/:id", () => {
    it("should fetch a shopping item by ID", async () => {
      const item = await ShoppingItem.create({
        name: "Apple",
        description: "A fresh apple",
        price: 0.5,
      });

      const response = await request(app).get(`/item/${item._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Apple");
    });

    it("should return 404 for a non-existent ID", async () => {
      const response = await request(app).get(`/item/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Item not found");
    });
  });

  describe("PUT /item/:id", () => {
    it("should update a shopping item with valid data", async () => {
      const item = await ShoppingItem.create({
        name: "Apple",
        description: "A fresh apple",
        price: 0.5,
      });

      const response = await request(app).put(`/item/${item._id}`).send({
        name: "Updated Apple",
        description: "An updated description",
        price: 0.6,
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Apple");
      expect(response.body.price).toBe(0.6);
    });

    it("should return 404 for a non-existent ID", async () => {
      const response = await request(app).put(`/item/${new mongoose.Types.ObjectId()}`).send({
        name: "Updated Name",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Item not found");
    });
  });

  describe("DELETE /item/:id", () => {
    it("should delete a shopping item and remove it from all lists", async () => {
      const item = await ShoppingItem.create({
        name: "Apple",
        description: "A fresh apple",
        price: 0.5,
      });

      const list = await ShoppingList.create({
        name: "Groceries",
        description: "Weekly groceries",
        items: [{ item: item._id, quantity: 1, status: "not purchased" }],
      });

      const response = await request(app).delete(`/item/${item._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item deleted and removed from all shopping lists");

      const updatedList = await ShoppingList.findById(list._id);
      expect(updatedList?.items).toHaveLength(0);
    });

    it("should return 404 for a non-existent ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`/item/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Item not found");
    });
  });
});