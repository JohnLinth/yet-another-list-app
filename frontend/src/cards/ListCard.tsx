import React from "react";
import { IShoppingList } from "../types/interfaces";
import EditDeleteDropdown from "../common/EditDeleteDropdown";

interface ListCardProps {
  list: IShoppingList;
  onClick: () => void;
  onDelete: (id: string) => void;
  onEdit: (list: IShoppingList) => void;
}

const ListCard: React.FC<ListCardProps> = ({
  list,
  onClick,
  onDelete,
  onEdit,
}) => {
  const { _id, name, description, items } = list;
  return (
    <div
      className="flex items-center justify-between w-full p-4 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold">{name}</h2>
        <div>
          <p className="text-gray-500 truncate">{description}</p>
          <p className="text-gray-700">{items.length} Artikeln</p>
        </div>
      </div>
      <div className="relative flex items-center flex-shrink-0 space-x-2 text-right">
        <EditDeleteDropdown
          onEdit={() => onEdit(list)} // Pass list to onEdit
          onConfirmDelete={() => onDelete(_id)}
        />
      </div>
    </div>
  );
};

export default ListCard;
