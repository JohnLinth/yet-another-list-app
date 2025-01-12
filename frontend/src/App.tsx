import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./bars/Navbar";
import ProductOverviewPage from "./pages/ProductOverviewPage";
import ShoppingListOverview from "./pages/ShoppingListOverviewPage";
import ShoppingListPage from "./pages/ShoppingListPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-grow w-full overflow-auto bg-gray-200">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<ShoppingListOverview />} /> {/* Default route */}
            <Route path="/shopping-lists" element={<ShoppingListOverview />} />
            <Route path="/products" element={<ProductOverviewPage />} />
            <Route path="/shopping-lists/:listId" element={<ShoppingListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
