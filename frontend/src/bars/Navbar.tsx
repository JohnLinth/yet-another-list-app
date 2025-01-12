import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// this is the main navbar of the app. it switches from a sidebar to a topbar depending on the screen size.
const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div>
      {/* Navbar for small screens */}
      <nav className="fixed flex items-center justify-between w-full h-16 p-4 bg-blue-500 sm:hidden">
        <div className="text-3xl font-semibold tracking-widest text-white">
          YALO
        </div>
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <div className="w-6 h-6 bg-black" />
          ) : (
            <div className="w-6 h-6" />
          )}
        </button>
        <div className="flex flex-row p-2 space-x-3">
          <LinkButton to="/shopping-lists" label="Einkaufslisten" />
          <LinkButton to="/products" label="Artikeln" />
        </div>
      </nav>

      {/* Sidebar for larger screens */}
      <aside
        className={`hidden sm:block w-64 h-full bg-gray-100 text-gray-800 border-r-2 border-gray-300 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 text-lg font-semibold text-center text-white bg-blue-500">
          Yet Another List App
        </div>
        <div className="flex flex-col p-2 space-y-3">
          <LinkButton to="/shopping-lists" label="Einkaufslisten" />
          <LinkButton to="/products" label="Artikeln" />
        </div>

        <div className="absolute bottom-0 w-64 p-4 text-sm text-white bg-blue-500">
          <p>Yet Another List App</p>
          <p>FWE 24-25 HDA</p>
          <p>John Linthicum © Nov. 2024</p>
        </div>
      </aside>
    </div>
  );
};

interface LinkButtonProps {
  to: string;
  label: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center w-full p-2 space-x-3 text-lg font-semibold no-underline transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-lg shadow sm:p-4 hover:bg-gray-50 hover:shadow-lg"
    >
      <ReceiptLongIcon className="text-blue-600" />
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
