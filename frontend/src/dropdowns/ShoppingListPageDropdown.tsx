import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import DropdownMenu from "./DynamicDropdown";

interface Option {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  subOptions?: Option[];
}

interface ListPageDropdownMenuProps {
  selectedSort: string | null;
  setSelectedSort: (value: string) => void;
  selectedFilter: string | null;
  setSelectedFilter: (value: string) => void;
  onEdit: () => void; // New callback for "Edit" action
}

const listOptions: Option[] = [
  {
    label: "Filtern nach",
    icon: <FilterAltIcon />,
    subOptions: [{ label: "Name", value: "name" }],
  },
  {
    label: "Sortieren nach",
    icon: <SortIcon />,
    subOptions: [
      { label: "Menge", value: "quantity" },
      { label: "A-Z", value: "a-z" },
      { label: "Preis", value: "price" },
      { label: "Status", value: "status" },
    ],
  },
  {
    label: "Edit",
    icon: <MoreVertIcon />,
    value: "edit",
  },
];

const ListPageDropdownMenu: React.FC<ListPageDropdownMenuProps> = ({
  selectedSort,
  setSelectedSort,
  selectedFilter,
  setSelectedFilter,
  onEdit,
}) => {
  const handleOptionSelect = (value: string) => {
    if (value === "edit") {
      onEdit();
    } else if (["name"].includes(value)) {
      setSelectedFilter(value);
    } else {
      setSelectedSort(value);
    }
  };

  return (
    <DropdownMenu
      options={listOptions}
      selectedOption={selectedSort || selectedFilter}
      setSelectedOption={handleOptionSelect}
    />
  );
};

export default ListPageDropdownMenu;
