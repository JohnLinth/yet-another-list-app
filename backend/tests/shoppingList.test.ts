import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import ShoppingList from "../src/models/ShoppingList";
import ShoppingItem from "../src/models/ShoppingItem";

// generate a unique database name for this test suite
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

describe("Shopping List API Tests", () => {
  describe("POST /list", () => {
    it("should return validation errors for a name longer than 50 characters", async () => {
      const response = await request(app).post("/list").send({
        name: "A".repeat(51),
        description: "Test description",
        items: [],
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain("Name must not exceed 50 characters.");
    });

    it("should return validation errors for a description longer than 255 characters", async () => {
      const response = await request(app).post("/list").send({
        name: "Valid name",
        description: "D".repeat(256),
        items: [],
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain("Description must not exceed 255 characters.");
    });

    it("should return validation errors if items are not an array", async () => {
      const response = await request(app).post("/list").send({
        name: "Valid name",
        description: "Valid description",
        items: "not an array",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain("Items must be an array.");
    });

    it("should validate items and return errors for missing fields", async () => {
      const response = await request(app).post("/list").send({
        name: "Valid name",
        description: "Valid description",
        items: [{ item: "", quantity: 0 }],
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain("Item at index 0 is missing 'item'.");
      expect(response.body.errors).toContain(
        "Item at index 0 must have a valid 'quantity' greater than 0."
      );
    });
  });

  describe("GET /list", () => {
    it("should return empty results if filter by item and no matches are found", async () => {
      const response = await request(app).get("/list?filter=item&search=NonExistentItem");
      expect(response.status).toBe(200);
      expect(response.body.lists).toHaveLength(0);
      expect(response.body.totalLists).toBe(0);
      expect(response.body.totalPages).toBe(0);
    });

    it("should return lists filtered by name", async () => {
      await ShoppingList.create({ name: "Groceries", description: "Test description", items: [] });
      const response = await request(app).get("/list?filter=name&search=Groceries");
      expect(response.status).toBe(200);
      expect(response.body.lists).toHaveLength(1);
      expect(response.body.lists[0].name).toBe("Groceries");
    });

    it("should return lists filtered by description", async () => {
      await ShoppingList.create({ name: "Test", description: "Special list", items: [] });
      const response = await request(app).get("/list?filter=description&search=Special");
      expect(response.status).toBe(200);
      expect(response.body.lists).toHaveLength(1);
      expect(response.body.lists[0].description).toBe("Special list");
    });
  });

  describe("GET /list/:id", () => {
    it("should return 404 if the list does not exist", async () => {
      const response = await request(app).get(`/list/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Shopping list not found");
    });
  });

  describe("PUT /list/:id", () => {
    it("should update a list and return the updated data", async () => {
      const milk = await ShoppingItem.create({ name: "Milk", description: "Fresh milk", price: 1.5 });
      const list = await ShoppingList.create({
        name: "Old List",
        description: "Old description",
        items: [],
      });

      const response = await request(app).put(`/list/${list._id}`).send({
        name: "Updated List",
        description: "Updated description",
        items: [{ item: milk._id, quantity: 1, status: "not purchased" }],
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated List");
      expect(response.body.description).toBe("Updated description");
      expect(response.body.items).toHaveLength(1);
    });

    it("should return 404 if the list to update does not exist", async () => {
      const response = await request(app).put(`/list/${new mongoose.Types.ObjectId()}`).send({
        name: "New List",
      });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Shopping list not found");
    });
  });

  describe("DELETE /list/:id", () => {
    it("should delete a list and return a success message", async () => {
      const list = await ShoppingList.create({
        name: "List to delete",
        description: "Will be deleted",
        items: [],
      });

      const response = await request(app).delete(`/list/${list._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Shopping list deleted");
    });
  });
});