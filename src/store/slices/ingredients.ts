import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/api";
import { OrderApi } from "./orders-ws";

export type IngredientItem = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

interface OrderData {
  ingredients: string[];
}

interface OrderDetailsResponse {
  success: boolean;
  orders: OrderApi[];
}

export interface IngredientItemInConstructor extends IngredientItem {
  uniqueId: string;
}
export interface InitialState {
  ingredients: IngredientItem[];
  ingredientsById: { [_id: string]: IngredientItem };
  status: "idle" | "loading" | "succeeded" | "failed";
  bun: IngredientItemInConstructor | null;
  filling: IngredientItemInConstructor[];
  order: {
    name: string;
    number: number;
    success: boolean;
  } | null;
  errorOrder: string | null | unknown;
  orderProcessing: boolean;
  currentOrder: {
    data: OrderApi | null;
    loading: boolean;
    error: string | null;
  };
}

export const initialState: InitialState = {
  ingredients: [],
  ingredientsById: {},
  status: "idle",
  bun: null,
  filling: [],
  order: null,
  errorOrder: null,
  orderProcessing: false,
  currentOrder: {
    data: null,
    loading: false,
    error: null,
  },
};

export const loadIngredients = createAsyncThunk("loadIngredients", async () => {
  const { data } = await axiosInstance.get(`/api/ingredients`);

  if (!data?.data) {
    throw new Error("Invalid response structure");
  }
  return data.data as IngredientItem[];
});

export const makeOrder = createAsyncThunk(
  "makeOrder",
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const orderData: OrderData = { ingredients: ingredientIds };
      const response: {
        data: {
          name: string;
          order: {
            number: number;
          };
          success: boolean;
        };
      } = await axiosInstance.post(`/api/orders`, orderData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  "orders/fetchByNumber",
  async (orderNumber: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<OrderDetailsResponse>(
        `/api/orders/${orderNumber}`
      );
      if (!response.data.success || !response.data.orders.length) {
        throw new Error("Заказ не найден");
      }
      return response.data.orders[0];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<InitialState["bun"]>) => {
      state.bun = action.payload;
    },
    addFilling: (state, action: PayloadAction<IngredientItemInConstructor>) => {
      state.filling = [...state.filling, action.payload];
    },
    clearOrder: (state) => {
      state.filling = [];
      state.bun = null;
      state.order = null;
    },
    setFilling: (state, action: PayloadAction<InitialState["filling"]>) => {
      state.filling = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        if (!Array.isArray(action.payload)) {
          return {
            ...state,
            status: "failed",
          };
        }
        state.status = "succeeded";
        state.ingredients = action.payload;

        state.ingredientsById = state.ingredients.reduce(
          (dict: { [key: string]: IngredientItem }, item) => {
            dict[item._id] = item;
            return dict;
          },
          {}
        );
      })
      .addCase(loadIngredients.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(makeOrder.pending, (state) => {
        state.orderProcessing = true;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderProcessing = false;
        state.order = {
          name: action.payload.name,
          number: action.payload.order.number,
          success: action.payload.success,
        };
        state.errorOrder = null;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.orderProcessing = false;
        state.errorOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder.loading = true;
        state.currentOrder.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder.loading = false;
        state.currentOrder.data = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrder.loading = false;
        state.currentOrder.error = action.payload as string;
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const ingredientsActions = {
  ...ingredientsSlice.actions,
  loadIngredients,
  makeOrder,
  fetchOrderByNumber,
};
