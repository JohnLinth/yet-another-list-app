import axios from "axios";
import { IShoppingItem, IShoppingList } from "../types/interfaces";

// the api page simplifies the communication with the backend

// create an axios instance for the backend
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// API object
const API = {

  // shopping item endpoints
  shoppingItems: {
    // create a new shopping item
    create: async (item: Omit<IShoppingItem, "id">): Promise<IShoppingItem> => {
      const response = await api.post<IShoppingItem>("/item", item);
      return response.data;
    },

    // get paginated shopping items (might need to adjust the query parameters)
    getAll: async (
      limit: number = 20,
      page: number = 1,
      sortBy?: string,
      order: "asc" | "desc" = "asc",
      filter?: string, 
      search?: string
    ): Promise<{
      items: IShoppingItem[];
      totalItems: number;
      currentPage: number;
      totalPages: number;
    }> => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("page", page.toString());
      if (sortBy) queryParams.append("sortBy", sortBy);
      queryParams.append("order", order);
      if (filter) queryParams.append("filter", filter); 
      if (search) queryParams.append("search", search); 
    
      const response = await api.get(`/item?${queryParams.toString()}`);
      return response.data;
    },

    // get shopping item by ID
    getById: async (id: string): Promise<IShoppingItem> => {
      const response = await api.get<IShoppingItem>(`/item/${id}`);
      return response.data;
    },

    // update shopping item
    update: async (id: string, updatedItem: Partial<IShoppingItem>): Promise<IShoppingItem> => {
      const response = await api.put<IShoppingItem>(`/item/${id}`, updatedItem);
      return response.data;
    },

    // delete shopping item
    delete: async (id: string): Promise<void> => {
      await api.delete(`/item/${id}`);
    },
  },

  // shopping list endpoints
  shoppingLists: {
    // create a new shopping list
    create: async (list: Omit<IShoppingList, "id" | "createdAt">): Promise<IShoppingList> => {
      const response = await api.post<IShoppingList>("/list", list);
      return response.data;
    },
  
    // get all shopping lists with filter, search, and pagination
    getAll: async (
      limit: number = 20,
      page: number = 1,
      sortBy?: string,
      order: "asc" | "desc" = "asc",
      filter?: string, 
      search?: string 
    ): Promise<{
      lists: IShoppingList[];
      totalLists: number;
      currentPage: number;
      totalPages: number;
    }> => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("page", page.toString());
      if (sortBy) queryParams.append("sortBy", sortBy);
      queryParams.append("order", order);
      if (filter) queryParams.append("filter", filter); 
      if (search) queryParams.append("search", search); 
  
      // for debugging:
      // console.log("/list?" + queryParams.toString());

      const response = await api.get(`/list?${queryParams.toString()}`);
      return response.data;
    },
  
    // get a shopping list by ID
    getById: async (id: string): Promise<IShoppingList> => {
      const response = await api.get<IShoppingList>(`/list/${id}`);
      return response.data;
    },
  
    // update a shopping list
    update: async (id: string, updatedList: Partial<IShoppingList>): Promise<IShoppingList> => {
      const response = await api.put<IShoppingList>(`/list/${id}`, updatedList);
      return response.data;
    },
  
    // delete a shopping list
    delete: async (id: string): Promise<void> => {
      await api.delete(`/list/${id}`);
    },
  
    // get lists containing a specific item by item ID
    getListsContainingItem: async (itemId: string): Promise<IShoppingList[]> => {
      const response = await api.get<IShoppingList[]>(`/list/contains/${itemId}`);
      return response.data;
    },
  },
};

export default API;
