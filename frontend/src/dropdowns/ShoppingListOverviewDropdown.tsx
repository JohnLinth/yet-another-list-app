import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import DropdownMenu from "./DynamicDropdown";

interface Option {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  subOptions?: Option[];
}

interface ListOverviewDropdownMenuProps {
  selectedSort: string | null;
  setSelectedSort: (value: string) => void;
  selectedFilter: string | null;
  setSelectedFilter: (value: string) => void;
}

const listOptions: Option[] = [
  {
    label: "Filtern nach",
    icon: <FilterAltIcon />,
    subOptions: [
      { label: "Suche nach Listennamen", value: "name" },
      { label: "Suche nach Beschreibung", value: "description" },
      { label: "Suche nach Produkt", value: "item" },
    ],
  },
  {
    label: "Sortieren nach",
    icon: <SortIcon />,
    subOptions: [
      { label: "Nach Artikelmenge", value: "amount" },
      { label: "A-Z", value: "a-z" },
      { label: "Datum", value: "date" },
    ],
  },
];

const ListOverviewDropdownMenu: React.FC<ListOverviewDropdownMenuProps> = ({
  selectedSort,
  setSelectedSort,
  selectedFilter,
  setSelectedFilter,
}) => {
  const handleOptionSelect = (value: string) => {
    if (["list", "description", "item"].includes(value)) {
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

export default ListOverviewDropdownMenu;
