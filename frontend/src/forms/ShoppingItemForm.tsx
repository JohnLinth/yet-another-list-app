import DynamicForm from "./DynamicForm";
import { IShoppingItem } from "../types/interfaces";

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<IShoppingItem>) => void;
  item?: Partial<IShoppingItem>; // data of the current item (for editing)
}
// form for adding or editing shopping items
const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
}) => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Artikel Name",
      limit: 50,
    },
    {
      name: "description",
      label: "Beschreibung",
      type: "textarea" as const,
      placeholder: "Artikel Beschreibung",
      limit: 255,
    },
    {
      name: "price",
      label: "Preis",
      type: "number" as const,
      placeholder: "Artikel Preis",
    },
  ];

  return (
    <DynamicForm
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      initialData={item || { name: "", description: "", price: 0.0 }}
      fields={fields}
      title={item ? "Artikel bearbeiten" : "Neuen Artikel hinzufügen"}
    />
  );
};

export default ItemForm;
