import React, { useState, useEffect, useCallback } from "react";
import ListPageDropdownMenu from "../dropdowns/ShoppingListPageDropdown";
import CustomSnackbar from "../common/CustomSnackbar";
import API from "../api/api";
import AddItemsDrawer from "../bars/AddItemsDrawer";
import {
  IShoppingListItem as ShoppingListItem,
  IShoppingItem as Item,
  IShoppingList,
} from "../types/interfaces";
import NoResultsFound from "../common/NoResultsFound";
import { useParams } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import Header from "../layout/Header";
import ItemForm from "../forms/ShoppingItemForm";
import ListItemCard from "../cards/ListItemCard";
import ListForm from "../forms/ShoppingListForm";

interface SnackbarMessage {
  message: string;
  color: string;
}

const ShoppingListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [listDetails, setListDetails] = useState<IShoppingList | null>(null); // Stores the full list object
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShoppingListItem[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isListFormOpen, setIsListFormOpen] = useState(false); // State for ListForm
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] =
    useState<SnackbarMessage | null>(null);

  // fetch the shopping list
  const fetchCurrentList = useCallback(async () => {
    if (!listId) return;
    try {
      const list = await API.shoppingLists.getById(listId);
      setListDetails(list);
      setItems(list.items || []);
      setFilteredItems(list.items || []);
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Abrufen der Liste",
        color: "red",
      });
    }
  }, [listId]);

  // fetch available items
  const fetchAvailableItems = useCallback(async () => {
    try {
      const allItems = await API.shoppingItems.getAll(50);
      setAvailableItems(allItems.items);
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Abrufen der verfügbaren Artikel",
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    fetchCurrentList();
    fetchAvailableItems();
  }, [fetchCurrentList, fetchAvailableItems]);

  // filter and sort items
  useEffect(() => {
    let updatedItems = [...items];

    if (debouncedSearchTerm) {
      const lowercasedSearch = debouncedSearchTerm.toLowerCase();
      updatedItems = updatedItems.filter(
        (item) =>
          item.item.name.toLowerCase().includes(lowercasedSearch) ||
          item.item.description.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (selectedSort) {
      updatedItems.sort((a, b) => {
        switch (selectedSort) {
          case "quantity":
            return b.quantity - a.quantity;
          case "price":
            return b.item.price - a.item.price;
          case "status":
            return a.status.localeCompare(b.status);
          case "a-z":
            return a.item.name.localeCompare(b.item.name);
          default:
            return 0;
        }
      });
    }

    setFilteredItems(updatedItems);
  }, [debouncedSearchTerm, items, selectedSort]);

  const handleToggleItemStatus = async (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.item._id === itemId
        ? {
            ...item,
            status: item.status === "purchased" ? "not purchased" : "purchased",
          }
        : item
    );
    setItems(updatedItems);

    try {
      await API.shoppingLists.update(listId!, { items: updatedItems });
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Aktualisieren des Artikelstatus",
        color: "red",
      });
    }
  };

  const handleAddItem = async (itemId: string) => {
    const itemToAdd = availableItems.find((item) => item._id === itemId);
    if (!itemToAdd) {
      setSnackbarMessage({ message: "Artikel nicht gefunden!", color: "red" });
      return;
    }

    const updatedItems = [
      ...items,
      { item: itemToAdd, quantity: 1, status: "not purchased" },
    ];
    setItems(updatedItems);

    try {
      await API.shoppingLists.update(listId!, { items: updatedItems });
      setSnackbarMessage({
        message: "Artikel erfolgreich hinzugefügt!",
        color: "green",
      });
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Hinzufügen des Artikels",
        color: "red",
      });
    }
  };

  const handleUpdateItemQuantity = async (
    itemId: string,
    newQuantity: number
  ) => {
    const updatedItems = items.map((item) =>
      item.item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);

    try {
      await API.shoppingLists.update(listId!, { items: updatedItems });
      setSnackbarMessage({
        message: "Artikelmenge erfolgreich aktualisiert!",
        color: "green",
      });
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Aktualisieren der Artikelmenge",
        color: "red",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedItems = items.filter((item) => item.item._id !== itemId);
    setItems(updatedItems);

    try {
      await API.shoppingLists.update(listId!, { items: updatedItems });
      setSnackbarMessage({
        message: "Artikel erfolgreich entfernt!",
        color: "green",
      });
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Entfernen des Artikels",
        color: "red",
      });
    }
  };

  const handleEditList = () => {
    setIsListFormOpen(true);
  };

  const handleSaveList = async (listData: Partial<IShoppingList>) => {
    try {
      await API.shoppingLists.update(listId!, listData);
      setListDetails((prev) => ({ ...prev!, ...listData }));
      setIsListFormOpen(false);
      setSnackbarMessage({
        message: "Liste erfolgreich aktualisiert!",
        color: "green",
      });
    } catch {
      setSnackbarMessage({
        message: "Fehler beim Aktualisieren der Liste",
        color: "red",
      });
    }
  };

  return (
    <div className="flex-1 w-full">
      <Header
        title={listDetails?.name || "Einkaufsliste"}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsSidebarOpen(!isSidebarOpen)}
        dropdown={
          <ListPageDropdownMenu
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedFilter={null}
            setSelectedFilter={() => {}}
            onEdit={handleEditList} // opens the form for editing
          />
        }
      />
      <div className="flex flex-row">
        <main className="w-full p-3 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((listItem) => (
              <ListItemCard
                key={listItem._id}
                listItem={listItem}
                onToggleStatus={() =>
                  handleToggleItemStatus(listItem.item._id!)
                }
                onDelete={() => handleDeleteItem(listItem.item._id!)}
                onEdit={() => {
                  setCurrentItem(listItem.item);
                  setIsItemFormOpen(true);
                }}
              />
            ))
          ) : (
            <NoResultsFound />
          )}
        </main>
        <AddItemsDrawer
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onUpdateItemQuantity={handleUpdateItemQuantity}
          onCreateItem={() => {
            setCurrentItem(null); // reset the current item
            setIsItemFormOpen(true); // open the item form for creating a new item
          }}
          availableItems={availableItems}
          currentShoppingListItems={items.reduce(
            (acc, curr) => ({ ...acc, [curr.item._id]: curr.quantity }),
            {}
          )}
        />
        ;
      </div>
      {/* Item Form Modal */}
      {isItemFormOpen && (
        <ItemForm
          isOpen={isItemFormOpen}
          onClose={() => setIsItemFormOpen(false)}
          item={currentItem || undefined}
          onSave={async (itemData: Partial<Item>) => {
            try {
              let savedItem: Item;

              if (itemData._id) {
                // if the item has an ID, update the existing item
                savedItem = await API.shoppingItems.update(
                  itemData._id,
                  itemData
                );

                // update the item in the shopping list and available items
                setItems((prevItems) =>
                  prevItems.map((listItem) =>
                    listItem.item._id === savedItem._id
                      ? { ...listItem, item: savedItem }
                      : listItem
                  )
                );
                setAvailableItems((prevAvailable) =>
                  prevAvailable.map((availableItem) =>
                    availableItem._id === savedItem._id
                      ? savedItem
                      : availableItem
                  )
                );

                setSnackbarMessage({
                  message: "Artikel erfolgreich aktualisiert!",
                  color: "green",
                });
              } else {
                // if there's no ID, create a new item
                savedItem = await API.shoppingItems.create(
                  itemData as Omit<Item, "id">
                );

                // add the new item to available items and shopping list
                setAvailableItems((prevAvailable) => [
                  savedItem,
                  ...prevAvailable,
                ]);
                const newListItems = [
                  ...items,
                  { item: savedItem, quantity: 1, status: "not purchased" },
                ];
                setItems(newListItems);

                // update the backend with the new list
                await API.shoppingLists.update(listId!, {
                  items: newListItems,
                });

                setSnackbarMessage({
                  message:
                    "Artikel erfolgreich erstellt und zur Liste hinzugefügt!",
                  color: "green",
                });
              }

              setIsItemFormOpen(false);
              setCurrentItem(null);
            } catch (error) {
              console.error("Error saving item:", error);
              setSnackbarMessage({
                message: "Fehler beim Speichern des Artikels",
                color: "red",
              });
            }
          }}
        />
      )}
      {/* List Form Modal */}
      {isListFormOpen && (
        <ListForm
          isOpen={isListFormOpen}
          onClose={() => setIsListFormOpen(false)}
          onSave={handleSaveList}
          currentList={{
            _id: listDetails?._id,
            name: listDetails?.name,
            description: listDetails?.description,
          }}
        />
      )}
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

export default ShoppingListPage;
