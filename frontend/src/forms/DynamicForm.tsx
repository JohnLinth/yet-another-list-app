import { useState, useEffect, useRef } from "react";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "number";
  placeholder?: string;
  limit?: number;
}

interface DynamicFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<T>) => void;
  initialData: Partial<T>;
  fields: Field[];
  title: string;
}

// dynamic form component that renders a form based on the fields provided
const DynamicForm = <T extends {}>({
  isOpen,
  onClose,
  onSave,
  initialData,
  fields,
  title,
}: DynamicFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const formRef = useRef<HTMLDivElement | null>(null); // ref for the form container

  useEffect(() => {
    setFormData(initialData); // reset formData when initialData changes
  }, [initialData]);

  const handleInputChange = (field: string, value: string | number) => {
    const fieldConfig = fields.find((f) => f.name === field);

    // enforce min value of 0 for numeric fields (numeric fields are always non-negative e.g. price, quantity)
    if (
      fieldConfig?.type === "number" &&
      typeof value === "number" &&
      value < 0
    ) {
      value = 0;
    }

    if (
      fieldConfig?.limit &&
      typeof value === "string" &&
      value.length > fieldConfig.limit
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // save form data and close the form
  const handleSave = () => {
    const missingFields = fields.filter(
      (f) =>
        formData[f.name as keyof T] === undefined || // undefined values
        (f.type === "text" && !formData[f.name as keyof T]) // empty text fields
    );

    if (missingFields.length) {
      alert(
        `Bitte füllen Sie alle Felder aus: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    onSave(formData);
    onClose();
  };

  // close the form when user clicks outside of it
  const handleMouseDown = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        // attach the ref to the form container
        ref={formRef}
        className="relative w-full p-6 bg-white rounded-lg shadow-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
      >
        <button
          aria-label="Formular schließen"
          onClick={onClose}
          className="absolute text-2xl font-bold text-gray-500 top-3 right-3 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="mb-4 text-xl font-bold">{title}</h2>

        {fields.map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block mb-2 font-semibold text-gray-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={(formData[field.name as keyof T] || "") as string}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type}
                value={
                  (formData[field.name as keyof T] ?? "") as string | number
                }
                onChange={(e) =>
                  handleInputChange(
                    field.name,
                    field.type === "number"
                      ? Math.max(parseFloat(e.target.value) || 0, 0) // enforce min of 0
                      : e.target.value
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={field.placeholder}
              />
            )}
            {field.limit && (
              <p className="text-sm text-gray-500">
                Verbleibende Zeichen: {field.limit -
                  (formData[field.name as keyof T]?.toString() || "")
                    .length}{" "}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-4 bg-gray-300 rounded hover:bg-gray-400"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
