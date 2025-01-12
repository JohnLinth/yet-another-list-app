import React from "react";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DropdownMenu, { Option } from "./DynamicDropdown";

interface ProductOverviewDropdownProps {
  selectedSort: string | null;
  setSelectedSort: (value: string) => void;
  selectedFilter: string | null;
  setSelectedFilter: (value: string) => void;
}

const ProductOverviewDropdown: React.FC<ProductOverviewDropdownProps> = ({
  selectedSort,
  setSelectedSort,
  selectedFilter,
  setSelectedFilter,
}) => {
  const productOptions: Option[] = [
    {
      label: "Filter nach",
      icon: <FilterAltIcon />,
      subOptions: [
        { label: "Suche nach Artikelname", value: "name" },
        { label: "Suche nach Beschreibung", value: "description" },
      ],
    },
    {
      label: "Sort by",
      icon: <SortIcon />,
      subOptions: [
        { label: "A-Z", value: "name" },
        { label: "Preis", value: "price" },
        { label: "Beschreibung", value: "description" },
      ],
    },
  ];

  const handleSelection = (value: string) => {
    if (["name", "description"].includes(value)) {
      setSelectedFilter(value);
    } else {
      setSelectedSort(value);
    }
  };

  return (
    <DropdownMenu
      options={productOptions}
      selectedOption={selectedSort || selectedFilter}
      setSelectedOption={handleSelection}
    />
  );
};

export default ProductOverviewDropdown;
