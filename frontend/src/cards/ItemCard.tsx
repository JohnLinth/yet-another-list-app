import React from "react";
import { IShoppingItem } from "../types/interfaces";
import EditDeleteDropdown from "../common/EditDeleteDropdown";

interface ItemCardProps {
  listItem: IShoppingItem;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  listItem,
  onDelete,
  onEdit,
  onClick,
}) => {
  const { _id, name, description, price } = listItem;
  return (
    <div
      className="flex items-center justify-between w-full p-4 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold">{name}</h2>
        <div>
          <p className="text-gray-500 truncate">{description}</p>
          <p className="text-gray-700">{price.toFixed(2)}€</p>
        </div>
      </div>
      <div
        className="relative flex items-center flex-shrink-0 space-x-2 text-right"
        onClick={(e) => e.stopPropagation()} // prevent dropdown click from triggering card click
      >
        <EditDeleteDropdown onEdit={onEdit} onConfirmDelete={onDelete} />
      </div>
    </div>
  );
};

export default ItemCard;
