import React from "react";
import { IShoppingListItem as ShoppingListItem } from "../types/interfaces";
import EditDeleteDropdown from "../common/EditDeleteDropdown";

interface ListItemCardProps {
  listItem: ShoppingListItem;
  onToggleStatus: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const ListItemCard: React.FC<ListItemCardProps> = ({
  listItem,
  onToggleStatus,
  onDelete,
  onEdit,
}) => {
  const { item, quantity, status } = listItem;

  return (
    <div
      className={`flex items-center justify-between w-full p-4 rounded-md shadow-md ${
        status === "purchased"
          ? "bg-green-100 hover:bg-green-200"
          : "bg-white hover:bg-gray-200"
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={status === "purchased"}
          onChange={(e) => {
            e.stopPropagation(); // prevent card click when toggling checkbox
            onToggleStatus();
          }}
          className="w-6 h-6 mr-4 cursor-pointer"
        />
        <div>
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-gray-500 truncate">{item.description}</p>
          <p className="text-gray-700">
            Menge {quantity} • Preis: {item.price.toFixed(2)}€
          </p>
        </div>
      </div>
      <div
        className="relative flex items-center flex-shrink-0 space-x-2 text-right"
        onClick={(e) => e.stopPropagation()} // Prevent dropdown clicks from bubbling
      >
        <EditDeleteDropdown
          onEdit={onEdit} // Open item form modal
          onConfirmDelete={onDelete} // Trigger delete function
        />
      </div>
    </div>
  );
};

export default ListItemCard;
