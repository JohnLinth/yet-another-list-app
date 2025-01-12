# **Frontend-Dokumentation**

## **Frontend**
Sobald alle Docker-Container mit `docker-compose` gestartet wurden, ist das Frontend unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

### **Klarstellung zu meiner minimalen Nutzung von Komponentenbibliotheken**

Ich habe zuvor kleine React-Projekte mit JavaScript entwickelt, häufig unter Verwendung von MUI oder anderen Komponentenbibliotheken sowie SASS. Für dieses Projekt wollte ich **Tailwind CSS** ausprobieren und meine Kenntnisse in **TypeScript** vertiefen, das mir neu ist, aber von meinen Kollegen sehr empfohlen wurde. Obwohl einige Teile effizienter mit einer Komponentenbibliothek umgesetzt hätten werden können, habe ich durch diese praktische Erfahrung viel gelernt. Vielen Dank für diese Möglichkeit (und Ihre Geduld)!

---

## **Suchfunktion**

Die Suchfunktionalität ist in der Komponente `Header.tsx` enthalten, die auf jeder Seite der Anwendung angezeigt wird. Sie enthält eine **Suchleiste**, die es Benutzern ermöglicht, nach Einkaufslisten oder Artikeln zu filtern.

```
typescript
const Header: React.FC<HeaderProps> = ({
  title,
  searchTerm,
  setSearchTerm,
  onAdd,
  dropdown,
}) => {
  return (
    <header>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </header>
  );
};
```

Die Eingabe wird durch die Eigenschaft `setSearchTerm` verarbeitet, wodurch eine Filteranfrage an das Backend ausgelöst wird, um die Ergebnisse dynamisch zu aktualisieren.

---

## **Routing**

Die Navigation zwischen den Seiten erfolgt mit **React Router** und ist in `App.tsx` definiert. Es gibt folgende Routen:

```
typescript
<Routes>
  <Route path="/" element={<ShoppingListOverview />} /> {/* Standardroute */}
  <Route path="/shopping-lists" element={<ShoppingListOverview />} />
  <Route path="/products" element={<ProductOverviewPage />} />
  <Route path="/shopping-lists/:listId" element={<ShoppingListPage />} />
</Routes>
```

### **Routenübersicht:**
- `/`: Zeigt die Übersicht aller Einkaufslisten (Standardroute).
- `/shopping-lists`: Zeigt ebenfalls die Einkaufslistenübersicht.
- `/products`: Zeigt die Produktübersicht mit Filter- und Sortierfunktionen.
- `/shopping-lists/:listId`: Lädt eine spezifische Einkaufsliste basierend auf der ID.

---

## **Fehlerbehandlung**

Fehlermeldungen und Benachrichtigungen werden über die Komponente `CustomSnackbar.tsx` angezeigt. Sie ist flexibel gestaltet und ermöglicht die Anzeige von Nachrichten mit individuell konfigurierbaren Farben und Dauer.

```
typescript
const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  message = "Operation erfolgreich!",
  bgColor = "#1976d2",
  duration = 3000,
  onClose,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <Snackbar
      open={open}
      message={message}
      style={{ backgroundColor: bgColor }}
    />
  );
};
```

Diese Snackbar wird in der Anwendung verwendet, um Erfolgsmeldungen, wie das Erstellen oder Aktualisieren von Artikeln, oder Fehlermeldungen bei ungültigen Eingaben anzuzeigen.

---

## **Hauptfunktionen**

### **1. Paginierung und Sortierung (Freestyle-Frage 1)**

Die `ListOverviewDropdownMenu.tsx`-Komponente ermöglicht Benutzern, Einkaufslisten zu sortieren und zu filtern. Sie enthält Optionen für Sortierung nach Artikelmenge, Namen (A-Z) und Datum sowie Filter nach Listennamen, Beschreibung oder Produkt.

```
typescript
const listOptions: Option[] = [
  {
    label: "Filtern nach",
    subOptions: [
      { label: "Suche nach Listennamen", value: "name" },
      { label: "Suche nach Beschreibung", value: "description" },
      { label: "Suche nach Produkt", value: "item" },
    ],
  },
  {
    label: "Sortieren nach",
    subOptions: [
      { label: "Nach Artikelmenge", value: "amount" },
      { label: "A-Z", value: "a-z" },
      { label: "Datum", value: "date" },
    ],
  },
];
```

Benutzer können eine Dropdown-Liste verwenden, um die gewünschten Optionen auszuwählen, und die Anwendung sendet die entsprechenden Filter- oder Sortieranfragen an das Backend.

---

## **Struktur und Komponenten**

### **pages**
- **`ProductOverviewPage.tsx`**: Zeigt alle Produkte mit Filter-, Sortier- und CRUD-Operationen.
- **`ShoppingListOverviewPage.tsx`**: Die Hauptseite der App für die Verwaltung von Einkaufslisten.
- **`ShoppingListPage.tsx`**: Verwaltert die Artikel innerhalb einer spezifischen Einkaufsliste.

### **api**
- **`api.tsx`**: Zentralisiert alle HTTP-Anfragen an das Backend für CRUD-Operationen.

### **bars**
- **`Header.tsx`**: Beinhaltet die Suchleiste, einen Hinzufügen-Button und Dropdown-Menüs.

### **cards**
- **`ListItemCard.tsx`**: Repräsentiert Artikel innerhalb einer Liste mit Bearbeitungs- und Löschoptionen.

### **common**
- **`CustomSnackbar.tsx`**: Zeigt Benachrichtigungen an.
- **`SearchBar.tsx`**: Wiederverwendbare Suchleiste.

### **dropdowns**
- **`ListOverviewDropdownMenu.tsx`**: Verwaltung von Filter- und Sortieroptionen.

### **hooks**
- **`useDebounce.tsx`**: Verhindert übermäßige API-Aufrufe bei Benutzereingaben.

---

## **Zusammenfassung**

Das Frontend bietet eine benutzerfreundliche Oberfläche mit Such-, Filter- und Sortierfunktionen. Es nutzt **React Router** für die Navigation und integriert sich nahtlos mit dem Backend, um CRUD-Operationen und dynamische Updates zu ermöglichen. Fehlerbehandlungen werden elegant über Snackbars gelöst, während modular gestaltete Komponenten die Erweiterbarkeit fördern.
