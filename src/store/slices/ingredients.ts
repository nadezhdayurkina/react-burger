import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/api";

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

export interface IngredientItemInConstructor extends IngredientItem {
  uniqueId: string;
}
interface InitialState {
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
}

const initialState: InitialState = {
  ingredients: [],
  ingredientsById: {},
  status: "idle",
  bun: null,
  filling: [],
  order: null,
  errorOrder: null,
  orderProcessing: false,
};

export const loadIngredients = createAsyncThunk("loadIngredients", async () => {
  const { data } = await axiosInstance.get(`/ingredients`);
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
      } = await axiosInstance.post(`/orders`, orderData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<IngredientItemInConstructor>) => {
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
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const ingredientsActions = {
  ...ingredientsSlice.actions,
  loadIngredients,
  makeOrder,
};
