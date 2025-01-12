import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface Option {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  subOptions?: Option[];
}

interface DropdownMenuProps {
  options: Option[];
  selectedOption: string | null;
  setSelectedOption: (value: string) => void;
}

// dropdown menu component with dynamic options and sub-options. this is a reusable component for dropdowns (e.g. filter, sort, etc.)
// it can display a list of options with or without sub-options
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleSubmenu = (submenu: string) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full p-2 text-black rounded-full hover:bg-gray-300 shrink-0 focus:outline-none"
      >
        <MoreVertIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg">
          {options.map((option, index) => (
            <div className="py-1" key={index}>
              {option.subOptions ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(option.label)}
                    className="flex justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    {option.icon}
                    <span>{option.label}</span>
                    <KeyboardArrowDownIcon />
                  </button>
                  {openSubmenu === option.label && (
                    <div className="py-2 bg-gray-50">
                      {option.subOptions.map((subOption, subIndex) => (
                        <button
                          key={subIndex}
                          className={`block w-full px-4 py-2 text-left ${
                            selectedOption === subOption.value
                              ? "bg-gray-300"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedOption(subOption.value || "");
                            setIsOpen(false);
                            setOpenSubmenu(null);
                          }}
                        >
                          {subOption.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setSelectedOption(option.value || "");
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-left space-x-2 ${
                    selectedOption === option.value
                      ? "bg-gray-300"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
