import React from "react";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// simple search bar component with search icon
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <div
    className={`flex items-center flex-grow justify-end rounded-2xl transition-all duration-300 ease-in-out ${
      searchTerm ? "border border-gray-300" : ""
    }`}
  >
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
      className="w-full px-2 bg-transparent rounded-full outline-none"
    />
    <button
      aria-label="search"
      className="order-first p-3 rounded-full hover:bg-gray-300"
    >
      <SearchIcon />
    </button>
  </div>
);

export default SearchBar;
