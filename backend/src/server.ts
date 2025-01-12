import app from "./app";
import connectDB from "./services/connectDB";

const port = 5000;

// start the server
(async () => {
  try {
    await connectDB(); // connect to the mongo db
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
})();
