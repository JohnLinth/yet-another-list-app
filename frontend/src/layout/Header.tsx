import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface HeaderProps {
  title: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
  dropdown: React.ReactNode;
}

// header component with search bar, add button and dropdown for each page
const Header: React.FC<HeaderProps> = ({
  title,
  searchTerm,
  setSearchTerm,
  onAdd,
  dropdown,
}) => {
  return (
    <header className="flex items-center justify-between h-20 p-4 mt-16 bg-white shadow-md sm:mt-0">
      <h1 className="hidden pr-4 text-xl font-semibold shrink-0 sm:block">
        {title}
      </h1>
      <div className="flex items-center flex-grow space-x-4">
        <div className="relative flex items-center flex-grow bg-gray-100 rounded-md">
          <SearchIcon className="absolute ml-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 text-sm bg-transparent border-none focus:outline-none"
          />
        </div>
        <button
          aria-label="add"
          className="p-3 bg-blue-500 rounded-full hover:bg-blue-800"
          onClick={onAdd}
        >
          <AddIcon className="text-white" />
        </button>
        {dropdown}
      </div>
    </header>
  );
};

export default Header;
