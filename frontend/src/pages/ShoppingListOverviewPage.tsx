import React, { useState, useEffect, useCallback } from "react";
import CustomSnackbar from "../common/CustomSnackbar";
import API from "../api/api";
import { IShoppingList } from "../types/interfaces";
import NoResultsFound from "../common/NoResultsFound";
import ListOverviewDropdown from "../dropdowns/ShoppingListOverviewDropdown";
import ListForm from "../forms/ShoppingListForm";
import useDebounce from "../hooks/useDebounce";
import ListCard from "../cards/ListCard";
import Header from "../layout/Header";
import Loading from "../common/Loading";

interface SnackbarMessage {
  message: string;
  color: string;
}

const ShoppingListOverview: React.FC = () => {
  // state variables
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedSort, setSelectedSort] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lists, setLists] = useState<IShoppingList[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListFormOpen, setIsListFormOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState<SnackbarMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [currentList, setCurrentList] = useState<
    Partial<IShoppingList> | undefined
  >(undefined);

  // fetch shopping lists from the API
  const fetchLists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await API.shoppingLists.getAll(
        20, // limit res to 20
        1, // singe page
        selectedSort,
        sortOrder,
        selectedFilter,
        debouncedSearchTerm
      );

      setLists(data.lists);
    } catch {
      showSnackbar("Fehler beim Abrufen der Listen", "red");
    } finally {
      setLoading(false);
    }
  }, [selectedSort, sortOrder, selectedFilter, debouncedSearchTerm]);

  // fetch lists whenever search, sort, or filter changes.
  useEffect(() => {
    fetchLists();
  }, [
    debouncedSearchTerm,
    selectedSort,
    sortOrder,
    selectedFilter,
    fetchLists,
  ]);

  // save or update a shopping list
  const handleSaveList = async (listData: Partial<IShoppingList>) => {
    try {
      if (currentList && currentList._id) {
        // update existing list
        await API.shoppingLists.update(currentList._id, listData);
        setLists((prevLists) =>
          prevLists.map((list) =>
            list._id === currentList._id ? { ...list, ...listData } : list
          )
        );
        showSnackbar("Liste erfolgreich aktualisiert!", "green");
      } else {
        // create a new list
        const savedList = await API.shoppingLists.create(
          listData as Omit<IShoppingList, "id" | "createdAt">
        );
        setLists((prevLists) => [savedList, ...prevLists]);
        showSnackbar("Liste erfolgreich erstellt!", "green");
      }
      setIsListFormOpen(false);
      setCurrentList(undefined);
    } catch {
      showSnackbar("Fehler beim Speichern der Liste", "red");
    }
  };

  // delete a shopping list
  const handleDeleteList = async (id: string) => {
    try {
      await API.shoppingLists.delete(id);
      setLists((prevLists) => prevLists.filter((list) => list._id !== id));
      showSnackbar("Liste erfolgreich gelöscht!", "red");
    } catch {
      showSnackbar("Fehler beim Löschen der Liste", "red");
    }
  };

  // open the list form to edit a list
  const handleEditList = (list: IShoppingList) => {
    setCurrentList(list);
    setIsListFormOpen(true);
  };

  // show a snackbar notification
  const showSnackbar = (message: string, color: string) =>
    setSnackbarMessage({ message, color });

  return (
    <div className="flex-1 w-full">
      {/* Header with search and dropdowns */}
      <Header
        title="Einkaufslisten"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {
          setCurrentList(undefined);
          setIsListFormOpen(true);
        }}
        dropdown={
          <ListOverviewDropdown
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
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        }
      />
      {/* Main content */}
      <main className="p-3 pt-4 space-y-4">
        {loading ? (
          <Loading />
        ) : lists.length > 0 ? (
          lists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              onDelete={handleDeleteList}
              onEdit={handleEditList}
              onClick={() => {
                window.location.href = `/shopping-lists/${list._id}`;
              }}
            />
          ))
        ) : (
          <NoResultsFound />
        )}
      </main>
      {/* List form modal */}
      {isListFormOpen && (
        <ListForm
          isOpen={isListFormOpen}
          onClose={() => setIsListFormOpen(false)}
          onSave={handleSaveList}
          currentList={currentList}
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

export default ShoppingListOverview;
