import React, { useState, useEffect, useCallback } from "react";
import ProductOverviewDropdown from "../dropdowns/ProductOverviewDropdown";
import CustomSnackbar from "../common/CustomSnackbar";
import API from "../api/api";
import { IShoppingItem } from "../types/interfaces";
import NoResultsFound from "../common/NoResultsFound";
import ItemForm from "../forms/ShoppingItemForm";
import ItemCard from "../cards/ItemCard";
import useDebounce from "../hooks/useDebounce";
import Header from "../layout/Header";

interface SnackbarMessage {
  message: string;
  color: string;
}

const ProductOverview: React.FC = () => {
  // state variables
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedSort, setSelectedSort] = useState("name");
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [items, setItems] = useState<IShoppingItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IShoppingItem | null>(null);
  const [snackbarMessage, setSnackbarMessage] =
    useState<SnackbarMessage | null>(null);

  // fetch items function (memoized with useCallback)
  const fetchItems = useCallback(
    async (reset = false) => {
      if (loading) return; // prevent duplicate calls
      setLoading(true);
      try {
        const data = await API.shoppingItems.getAll(
          20,
          reset ? 1 : currentPage,
          selectedSort,
          sortOrder,
          selectedFilter || "name",
          debouncedSearchTerm
        );
        setItems((prevItems) =>
          reset ? data.items : [...prevItems, ...data.items]
        );
        setTotalPages(data.totalPages);
      } catch {
        showSnackbar("Fehler beim Abrufen des Artikels", "#ffcccc");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, selectedSort, sortOrder, debouncedSearchTerm, selectedFilter]
  );

  // fetch items when search term, sort, or filter changes
  useEffect(() => {
    setCurrentPage(1); // reset page on filters or search change
    fetchItems(true);
  }, [
    debouncedSearchTerm,
    selectedSort,
    sortOrder,
    selectedFilter,
    fetchItems,
  ]);

  // infinite scrolling (uses pagination from backend)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        currentPage < totalPages
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, currentPage, totalPages]);

  // save or update an item
  const handleSaveItem = async (itemData: Partial<IShoppingItem>) => {
    try {
      const savedItem = itemData._id
        ? await API.shoppingItems.update(itemData._id, itemData)
        : await API.shoppingItems.create(itemData as Omit<IShoppingItem, "id">);

      setItems((prevItems) =>
        itemData._id
          ? prevItems.map((item) =>
              item._id === savedItem._id ? savedItem : item
            )
          : [savedItem, ...prevItems]
      );
      setIsItemFormOpen(false);
      setSelectedItem(null);
      showSnackbar(
        `Artikel erfolgreich ${itemData._id ? "aktualisiert" : "erstellt"}!`,
        "#ccffcc"
      );
    } catch {
      showSnackbar("Fehler beim Speichern des Artikels", "#ffcccc");
    }
  };

  // delete an item
  const handleDeleteItem = async (id: string) => {
    try {
      await API.shoppingItems.delete(id);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      showSnackbar("Artikel erfolgreich gelöscht!", "#ccffcc");
    } catch {
      showSnackbar("Fehler beim Löschen des Artikels", "#ffcccc");
    }
  };

  // show the custom mui snackbar with a message
  const showSnackbar = (message: string, color: string) =>
    setSnackbarMessage({ message, color });

  return (
    <div className="flex-1 w-full">
      {/* Header with search and dropdowns */}
      <Header
        title="Artikeln"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {
          setSelectedItem(null);
          setIsItemFormOpen(true);
        }}
        dropdown={
          <ProductOverviewDropdown
            selectedSort={selectedSort}
            setSelectedSort={(sort) => {
              if (selectedSort === sort) {
                setSortOrder((prevOrder) =>
                  prevOrder === "asc" ? "desc" : "asc"
                );
              } else {
                setSelectedSort(sort);
                setSortOrder("asc");
              }
            }}
            selectedFilter={selectedFilter || "name"}
            setSelectedFilter={setSelectedFilter}
          />
        }
      />
      {/* Main content */}
      <main className="p-3 pt-4 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemCard
              key={item._id}
              listItem={item}
              onClick={() => {
                setSelectedItem(item);
                setIsItemFormOpen(true);
              }}
              onEdit={() => {
                setSelectedItem(item);
                setIsItemFormOpen(true);
              }}
              onDelete={() => handleDeleteItem(item._id)}
            />
          ))
        ) : (
          <NoResultsFound />
        )}
      </main>
      {/* Item form modal */}
      {isItemFormOpen && (
        <ItemForm
          isOpen={isItemFormOpen}
          onClose={() => setIsItemFormOpen(false)}
          item={selectedItem || undefined}
          onSave={handleSaveItem}
        />
      )}
      {/* Snackbar notifications */}
      {snackbarMessage && (
        <CustomSnackbar
          message={snackbarMessage.message}
          bgColor={snackbarMessage.color}
          duration={4000}
          onClose={() => setSnackbarMessage(null)}
        />
      )}
    </div>
  );
};

export default ProductOverview;
