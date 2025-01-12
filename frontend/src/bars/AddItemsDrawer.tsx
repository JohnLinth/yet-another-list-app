import React, { FC, useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchBar from "../common/SearchBar";
import { IShoppingItem as Item } from "../types/interfaces";

interface AddItemsDrawerProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onAddItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItemQuantity: (itemId: string, newQuantity: number) => void;
  onCreateItem: () => void;
  availableItems: Item[];
  currentShoppingListItems: Record<string, number>; // map of itemId -> quantity
}

const AddItemsDrawer: FC<AddItemsDrawerProps> = ({
  isOpen,
  setIsOpen,
  onAddItem,
  onDeleteItem,
  onUpdateItemQuantity,
  onCreateItem,
  availableItems,
  currentShoppingListItems,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(availableItems);
  const [interactionTimestamp, setInteractionTimestamp] = useState<number>(0);

  // filter items based on the search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(availableItems);
    }
  }, [searchTerm, availableItems]);

  // sort the list by quantity after interactions
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (Date.now() - interactionTimestamp > 300) {
        setFilteredItems((prevItems) =>
          [...prevItems].sort((a, b) => {
            const qtyA = currentShoppingListItems[a._id] || 0;
            const qtyB = currentShoppingListItems[b._id] || 0;
            return qtyB - qtyA; // descending order by quantity
          })
        );
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [interactionTimestamp, currentShoppingListItems]);

  const handleIncrement = (itemId: string) => {
    setInteractionTimestamp(Date.now());
    const currentQuantity = currentShoppingListItems[itemId] || 0;
    if (currentQuantity === 0) {
      onAddItem(itemId);
    } else {
      onUpdateItemQuantity(itemId, currentQuantity + 1);
    }
  };

  const handleDecrement = (itemId: string) => {
    setInteractionTimestamp(Date.now());
    const currentQuantity = currentShoppingListItems[itemId] || 0;
    if (currentQuantity > 1) {
      onUpdateItemQuantity(itemId, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      onDeleteItem(itemId);
    }
  };

  const handleCloseSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false); // only close if the click is directly on the overlay
    }
  };

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 sm:hidden"
          onClick={handleCloseSidebar} // close only when clicking on the overlay
        />
      )}
      <div
        className={`fixed sm:relative top-0 right-0 h-screen bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-80 sm:w-96 opacity-100 ml-4" : "w-0 opacity-0 ml-0"
        } overflow-hidden`}
      >
        <div className="relative flex flex-col h-full p-4">
          <button
            className="absolute text-3xl text-gray-600 top-2 right-2 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          <h2 className="mb-2 text-lg font-semibold">Add Items</h2>

          {/* Search bar */}
          <div className="mb-2">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {/* Scrollable container for items */}
          <div className="flex-1 pt-2 overflow-y-auto border-t border-gray-200">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2"
              >
                <span className="w-40 truncate" title={item.name}>
                  {item.name.length > 22
                    ? `${item.name.slice(0, 22)}...`
                    : item.name}
                </span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleDecrement(item._id)}>
                    <RemoveCircleIcon className="text-red-500" />
                  </button>
                  <span className="w-8 text-center">
                    {currentShoppingListItems[item._id] || 0}
                  </span>
                  <button onClick={() => handleIncrement(item._id)}>
                    <AddCircleIcon className="text-green-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Item button */}
          <div className="py-2 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevents sidebar closure
                onCreateItem();
              }}
              className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Create Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemsDrawer;
