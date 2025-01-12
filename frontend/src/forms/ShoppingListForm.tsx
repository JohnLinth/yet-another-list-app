import DynamicForm from "./DynamicForm";
import { IShoppingList } from "../types/interfaces";

interface ListFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (list: Partial<IShoppingList>) => void; 
  currentList?: Partial<IShoppingList>;
}

// form for adding or editing shopping lists
const ListForm: React.FC<ListFormProps> = ({
  isOpen,
  onClose,
  onSave,
  currentList,
}) => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Listenname",
      limit: 50,
    },
    {
      name: "description",
      label: "Beschreibung",
      type: "textarea" as const,
      placeholder: "Listenbeschreibung",
      limit: 255,
    },
  ];

  return (
    <DynamicForm
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      initialData={currentList || { name: "", description: "", items: [] }}
      fields={fields}
      title={currentList ? "Liste bearbeiten" : "Neue Liste hinzufügen"}
    />
  );
};

export default ListForm;
