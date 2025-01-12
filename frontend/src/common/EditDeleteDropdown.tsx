import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface EditDeleteDropdownProps {
  onConfirmDelete: () => void;
  onEdit: () => void;
}

// simple dropdown component for edit and delete actions on cards
const EditDeleteDropdown: React.FC<EditDeleteDropdownProps> = ({
  onConfirmDelete,
  onEdit,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents item card click
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
      setIsConfirming(false); // Close confirm dialog if clicking outside
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents item card click
    setIsConfirming(true);
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsConfirming(false);
    setIsDropdownOpen(false); // Close the dropdown
  };

  const handleConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onConfirmDelete(); // Trigger the delete function
    setIsConfirming(false);
    setIsDropdownOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(); // Trigger the edit function
    setIsDropdownOpen(false); // Close the dropdown after clicking edit
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-300"
        onClick={toggleDropdown}
      >
        <MoreVertIcon />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 transition-all duration-300 bg-white border border-gray-300 rounded-md shadow-lg">
          {!isConfirming ? (
            <div>
              <button
                onClick={handleEditClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full p-2 space-x-3 transition-all duration-300">
              <button
                onClick={handleConfirmClick}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditDeleteDropdown;
