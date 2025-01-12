# **Backend-Dokumentation**

Dieses Backend dient als API-Schicht zur Verwaltung von Einkaufslisten und Einkaufsartikeln. Es verwendet **Node.js**, **Express** und **MongoDB** für die Speicherung persistenter Daten. Die MongoDB-Datenbank wird in einem separaten Docker-Container betrieben, der in der `docker-compose.yml` Datei definiert ist, um die Daten persistent und isoliert zu halten.

---

## **Inhaltsverzeichnis**

- [Projektstruktur](#projektstruktur)
- [Middleware](#middleware)
  - [Fehlerbehandlungs-Middleware](#1-fehlerbehandlungs-middleware)
  - [Async Wrapper](#2-async-wrapper)
- [Hauptfunktionen](#hauptfunktionen)
  - [Paginierung und Sortierung (Freestyle-Frage 1)](#1-paginierung-und-sortierung-freestyle-frage-1)
  - [Erweiterungen für Artikel (Freestyle-Frage 1)](#2-erweiterungen-für-artikel-freestyle-frage-1)
- [Freestyle-Frage 2](#freestyle-frage-2)
- [Setup](#setup)

## **Projektstruktur**

Die Struktur des Projekts folgt den **Best Practices**, wie sie in den Vorlesungen demonstriert wurden. Ziel ist es, den Code übersichtlich, wartbar und erweiterbar zu gestalten.

```
backend/
│
├── src/
│   ├── controllers/            # Enthält die Logik für API-Endpunkte
│   │   ├── shoppingItemController.ts
│   │   └── shoppingListController.ts
│   ├── middleware/             # Middleware für Fehlerbehandlung
│   │   └── errorMiddleware.ts
│   ├── models/                 # Datenbankmodelle und Schemas
│   │   ├── ShoppingItem.ts
│   │   └── ShoppingList.ts
│   ├── routes/                 # Definiert die API-Routen
│   │   ├── shoppingItemRoutes.ts
│   │   └── shoppingListRoutes.ts
│   ├── services/               # Datenbankverbindung
│   │   └── connectDB.ts
│   ├── utils/                  # Utility-Funktionen und App-Setup
│   │   └── app.ts
│   └── server.ts               # Startskript der Anwendung
│
├── Dockerfile                  # Definiert das Docker-Image
├── docker-compose.yml          # Orchestriert mehrere Container (z. B. MongoDB)
└── package.json                # Abhängigkeiten und Skripte
```

### **Begründung für die Struktur:**
1. **Modularität:**
    - Jede Komponente (z. B. Modelle, Controller, Middleware) hat ihren eigenen Ordner, um den Code logisch zu trennen.
    - Dies erleichtert das Auffinden und Bearbeiten von Code.

2. **Wartbarkeit:**
    - Klare Trennung von Verantwortlichkeiten (z. B. Controller für die API-Logik, Middleware für die Fehlerbehandlung).
    - Änderungen in einer Komponente wirken sich nicht auf andere aus.

3. **Erweiterbarkeit:**
    - Neue Features oder Endpunkte können leicht hinzugefügt werden, ohne die bestehende Struktur zu ändern.

4. **Best Practices:**
    - Die Struktur wurde gemäß den in den Vorlesungen gezeigten Best Practices implementiert, um eine professionelle und skalierbare Architektur zu gewährleisten.

---

## **API**
Alle Details / Endpoints zur API finden Sie in detail in der [API.md](API.md) Datei 

---

## **Schemas und UML-Diagramm**

### **Übersicht**

Die Datenbank und App verwendet im Wesentlichen das gesamte Schema, das in der Datenbank definiert ist. Hier ist eine kurze Übersicht darüber: 

![UML-Diagramm](./data/list_datastructure.png "Backend Schemas")
Eine visuelle Darstellung der Beziehungen und Strukturen ist im UML-Diagramm in der Datei BACKEND_SCHEMAS_UML.png enthalten.

### **1. Shopping Item Schema**

Das `ShoppingItem`-Schema beschreibt einzelne Artikel.

```json
{
  "name": "Apple",              // String, max. 50 Zeichen, erforderlich
  "description": "A fresh apple", // String, max. 255 Zeichen, erforderlich
  "price": 0.5                  // Zahl, erforderlich, Preis in EUR
}
```

- **Erläuterung:**  
  Das Attribut `price` wurde hinzugefügt, um Kosten besser verwalten und anzeigen zu können.  
  Dieses Attribut kann sortiert werden und wird auch im Frontend angezeigt.

- **Modell:** Definiert in `ShoppingItem.ts`.

---

### **2. Shopping List Schema**

Das `ShoppingList`-Schema beschreibt Listen, die aus mehreren Artikeln bestehen.

```json
{
  "name": "Weekly Groceries",   // String, max. 50 Zeichen, erforderlich
  "description": "Items to buy for the week", // String, max. 255 Zeichen, erforderlich
  "createdAt": "2024-01-01T12:00:00Z", // Datum, Standard ist das Erstellungsdatum
  "items": [                    // Array von Artikeln
    {
      "item": "63f9d8b7cfd95e001234abcd", // Referenz auf ShoppingItem
      "quantity": 5,                     // Zahl, erforderlich
      "status": "not purchased"          // String, enum, Standard ist 'not purchased'
    }
  ]
}
```

- **Erläuterung:**  
  Das Feld `status` ist kein Boolean, um in der Zukunft weitere Statuswerte (z. B. "out of stock") zu ermöglichen. Diese Erweiterung wurde jedoch nicht umgesetzt.

- **Modell:** Definiert in `ShoppingList.ts`.

---

## **Middleware**

In der Middleware wurden zwei wichtige Funktionen implementiert:

### **1. Fehlerbehandlungs-Middleware**
Die Middleware formatiert Fehlernachrichten und sendet sie an den Client zurück, um eine einheitliche Fehlerbehandlung zu gewährleisten.

```typescript
export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
     message: err.message || "Ein interner Serverfehler ist aufgetreten.",
  });
};
```

### **2. Async Wrapper**
Eine Utility-Funktion, die dabei hilft, redundante `try/catch`-Blöcke in den Controllern zu vermeiden.

```typescript
export const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Beispiel in einem Controller:**
```typescript
export const createShoppingItem = asyncWrapper(async (req, res) => {
  const { name, description, price } = req.body;
  const newItem = new ShoppingItem({ name, description, price });
  const savedItem = await newItem.save();
  res.status(201).json(savedItem);
});
```

---

## **Hauptfunktionen**

### **1. Paginierung und Sortierung (Freestyle-Frage 1)**

Die `GET`-Endpunkte für Einkaufsartikel und -listen unterstützen Paginierung und Sortierung nach bestimmten Attributen.
Ein Benutzer kann angeben, welche Seite er sehen möchte und wie viele Elemente pro Seite angezeigt werden sollen.
Dies ist besonders nützlich für Projekte, bei denen Skalierbarkeit eine wichtige Rolle spielt, da das Frontend nur die Daten lädt, die der Benutzer tatsächlich sehen möchte.

- **Implementierung** (Beispiel für Einkaufsartikel):
    ```typescript
    const { sortBy, order, limit, page } = req.query;
    const limitValue = parseInt(limit as string) || 20;
    const pageValue = parseInt(page as string) || 1;
    const skip = (pageValue - 1) * limitValue;

    const sortOptions: any = {};
    if (sortBy) {
        sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const items = await ShoppingItem.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limitValue);
    ```

### **2. Erweiterungen für Artikel (Freestyle-Frage 1)**

Das Attribut `price` wurde zu Artikeln hinzugefügt, um Kosten besser verwalten und anzeigen zu können. Dieses Attribut kann dank des neuen Sortierungsendpunkts natürlich auch sortiert werden und wird zudem auf dem Frontend angezeigt, um dem Benutzer eine klare Übersicht über die Preise zu bieten.

---

## **Freestyle-Frage 2**
[Leer lassen, wie gefordert.]

## **Setup**

Die vollständige Einrichtung wird im Haupt-README der Repository beschrieben. Hier die wichtigsten Schritte:

1. **All Container starten:**
    ```bash
    docker-compose up -d --build
    ```

    Dies startet den Alle container (MongoDB, Backend, Frontend) - die MongoDB-Containe ist eine Abhängigkeit für die Backend darstellt also es ist wichtig das er zuerst startet.

2. **Tests ausführen:**
    ```bash
    docker exec backend npm test
    ```

    Dies führt die Jest-Tests aus und generiert die Testabdeckung (Coverage).