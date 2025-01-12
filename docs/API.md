# **Einkaufsartikel-API-Dokumentation**

Zusammen mit dieser Dokumentation ist eine Postman-Suite enthalten. Sie befindet sich im Ordner `./docs/data/` unter dem Namen:
[Shopping List API FWE.postman_collection.json](./data/Shopping%20List%20API%20FWE.postman_collection.json)

## **Routenübersicht**

| Route     | Methode | Beschreibung                                                                       |
| --------- | ------- | ---------------------------------------------------------------------------------- |
| /item     | POST    | Erstellt einen neuen Einkaufsartikel.                                              |
| /item     | GET     | Ruft alle Einkaufsartikel mit Filtern, Sortierungen und Paginierung ab.            |
| /item/:id | GET     | Ruft einen Einkaufsartikel anhand seiner ID ab.                                    |
| /item/:id | PUT     | Aktualisiert einen Einkaufsartikel anhand seiner ID.                               |
| /item/:id | DELETE  | Löscht einen Einkaufsartikel anhand seiner ID und entfernt ihn aus Einkaufslisten. |
| /list     | POST    | Erstellt eine neue Einkaufsliste.                                                  |
| /list     | GET     | Ruft alle Einkaufslisten mit Filtern, Sortierungen und Paginierung ab.             |
| /list/:id | GET     | Ruft eine spezifische Einkaufsliste anhand ihrer ID ab.                            |
| /list/:id | PUT     | Aktualisiert eine Einkaufsliste anhand ihrer ID.                                   |
| /list/:id | DELETE  | Löscht eine Einkaufsliste anhand ihrer ID.                                         |

## Endpunkte für Einkaufsartikel

## **Endpoints Dokumentation**

### **1. Einkaufsartikel erstellen**

- **URL**: /item
- **Methode**: POST
- **Beschreibung**: Erstellt einen neuen Einkaufsartikel.
- **Request Body**:

  ```json
  {
    "name": "string (erforderlich, max. 50 Zeichen)",
    "description": "string (optional, max. 255 Zeichen)",
    "price": "number (erforderlich, positiv)"
  }
  ```

- **Antworten**

  - 201 Created:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "__v": 0
    }
    ```

  - 400 Bad Request: Wenn die Validierung fehlschlägt.

    ```json
    {
      "message": "Validation failed",
      "errors": ["Fehlermeldung(en)"]
    }
    ```

---

### **2. Alle Einkaufsartikel abrufen**

- **URL**: /item
- **Methode**: GET
- **Beschreibung**: Ruft alle Einkaufsartikel mit optionalen Filtern, Sortierungen und Paginierung ab.
- **Query-Parameter**:
  - sortBy: name | price | description (Standard: keine).
  - order: asc | desc (Standard: asc).
  - filter: Feld zum Filtern (z. B. name, description).
  - search: Suchbegriff für das Filtern.
  - limit: Anzahl der Artikel pro Seite (Standard: 20).
  - page: Seitenzahl (Standard: 1).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "items": [
        {
          "_id": "string",
          "name": "string",
          "description": "string",
          "price": "number"
        }
      ],
      "totalItems": "number",
      "currentPage": "number",
      "totalPages": "number"
    }
    ```

---

### **3. Einkaufsartikel nach ID abrufen**

- **URL**: /item/:id
- **Methode**: GET
- **Beschreibung**: Ruft einen spezifischen Einkaufsartikel anhand seiner ID ab.
- **Pfadparameter**:
  - id: string (Die ID des Einkaufsartikels).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": "number"
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Item not found"
    }
    ```

---

### **4. Einkaufsartikel aktualisieren**

- **URL**: /item/:id
- **Methode**: PUT
- **Beschreibung**: Aktualisiert die Details eines Einkaufsartikels.
- **Pfadparameter**:
  - id: string (Die ID des Einkaufsartikels).
- **Request Body**:

  ```json
  {
    "name": "string (optional, max. 50 Zeichen)",
    "description": "string (optional, max. 255 Zeichen)",
    "price": "number (optional, positiv)"
  }
  ```

- **Antworten**:

  - 200 OK:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": "number"
    }
    ```

  - 400 Bad Request:

    ```json
    {
      "message": "Validation failed",
      "errors": ["Fehlermeldung(en)"]
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Item not found"
    }
    ```

---

### **5. Einkaufsartikel löschen**

- **URL**: /item/:id
- **Methode**: DELETE
- **Beschreibung**: Löscht einen Einkaufsartikel und entfernt ihn aus allen zugehörigen Einkaufslisten.
- **Pfadparameter**:
  - id: string (Die ID des Einkaufsartikels).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "message": "Item deleted and removed from all shopping lists"
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Item not found"
    }
    ```

---

## **Hinweise**

1. **Validierung**:

   - Die Felder `name`, `description` und `price` werden validiert und bereinigt.
   - `price` muss eine positive Zahl sein.
   - `name` darf maximal 50 Zeichen und `description` maximal 255 Zeichen lang sein.

2. **Fehlerbehandlung**:

   - Validierungsfehler liefern eine `400 Bad Request`-Antwort mit detaillierten Fehlermeldungen.
   - Nicht vorhandene Ressourcen liefern eine `404 Not Found`-Antwort.

3. **Sortierung und Filterung**:

   - Sortierung ist für die Felder `name`, `price` und `description` möglich.
   - Filterung erfolgt über die Parameter `filter` und `search`.

4. **Paginierung**:
   - Unterstützt paginierte Ergebnisse mit den Parametern `limit` und `page`.

---

### **6. Einkaufsliste erstellen**

- **URL**: /list
- **Methode**: POST
- **Beschreibung**: Erstellt eine neue Einkaufsliste.
- **Request Body**:

  ```json
  {
    "name": "string (erforderlich, max. 50 Zeichen)",
    "description": "string (optional, max. 255 Zeichen)",
    "items": [
      {
        "item": "string (erforderlich, Item-ID)",
        "quantity": "number (erforderlich, größer als 0)",
        "status": "string (optional, Standard: 'not purchased')"
      }
    ]
  }
  ```

- **Antworten**

  - 201 Created:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "items": [
        {
          "item": "string",
          "quantity": "number",
          "status": "string"
        }
      ],
      "__v": 0
    }
    ```

  - 400 Bad Request:

    ```json
    {
      "message": "Validation failed",
      "errors": ["Fehlermeldung(en)"]
    }
    ```

---

### **7. Alle Einkaufslisten abrufen**

- **URL**: /list
- **Methode**: GET
- **Beschreibung**: Ruft alle Einkaufslisten mit optionalen Filtern, Sortierungen und Paginierung ab.
- **Query-Parameter**:
  - filter: item | name | description (Feld zum Filtern).
  - search: Suchbegriff für das Filtern.
  - sortBy: name | createdAt (Standard: keine Sortierung).
  - order: asc | desc (Standard: asc).
  - limit: Anzahl der Listen pro Seite (Standard: 20).
  - page: Seitenzahl (Standard: 1).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "lists": [
        {
          "_id": "string",
          "name": "string",
          "description": "string",
          "items": [
            {
              "item": {
                "_id": "string",
                "name": "string",
                "description": "string",
                "price": "number"
              },
              "quantity": "number",
              "status": "string"
            }
          ]
        }
      ],
      "totalLists": "number",
      "currentPage": "number",
      "totalPages": "number"
    }
    ```

---

### **8. Einkaufsliste nach ID abrufen**

- **URL**: /list/:id
- **Methode**: GET
- **Beschreibung**: Ruft eine spezifische Einkaufsliste anhand ihrer ID ab.
- **Pfadparameter**:
  - id: string (Die ID der Einkaufsliste).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "items": [
        {
          "item": {
            "_id": "string",
            "name": "string",
            "description": "string",
            "price": "number"
          },
          "quantity": "number",
          "status": "string"
        }
      ]
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Shopping list not found"
    }
    ```

---

### **9. Einkaufsliste aktualisieren**

- **URL**: /list/:id
- **Methode**: PUT
- **Beschreibung**: Aktualisiert eine Einkaufsliste.
- **Pfadparameter**:
  - id: string (Die ID der Einkaufsliste).
- **Request Body**:

  ```json
  {
    "name": "string (optional, max. 50 Zeichen)",
    "description": "string (optional, max. 255 Zeichen)",
    "items": [
      {
        "item": "string (erforderlich, Item-ID)",
        "quantity": "number (erforderlich, größer als 0)",
        "status": "string (optional)"
      }
    ]
  }
  ```

- **Antworten**:

  - 200 OK:

    ```json
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "items": [
        {
          "item": {
            "_id": "string",
            "name": "string",
            "description": "string",
            "price": "number"
          },
          "quantity": "number",
          "status": "string"
        }
      ]
    }
    ```

  - 400 Bad Request:

    ```json
    {
      "message": "Validation failed",
      "errors": ["Fehlermeldung(en)"]
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Shopping list not found"
    }
    ```

---

### **10. Einkaufsliste löschen**

- **URL**: /list/:id
- **Methode**: DELETE
- **Beschreibung**: Löscht eine Einkaufsliste anhand ihrer ID.
- **Pfadparameter**:
  - id: string (Die ID der Einkaufsliste).
- **Antworten**:

  - 200 OK:

    ```json
    {
      "message": "Shopping list deleted"
    }
    ```

  - 404 Not Found:

    ```json
    {
      "message": "Shopping list not found"
    }
    ```
