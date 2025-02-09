import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/apiConfig";

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
// uuid4()
interface InitialState {
  ingredients: IngredientItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  currentIngredient: IngredientItem | null;
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
  status: "idle",
  currentIngredient: null,
  bun: null,
  filling: [],
  order: null,
  errorOrder: null,
  orderProcessing: false,
};

export const fetchIngredients = createAsyncThunk(
  "fetchIngredients",
  async () => {
    const { data } = await axios.get(`${BASE_URL}/ingredients`);
    return data.data;
  }
);

export const makeOrder = createAsyncThunk(
  "makeOrder",
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      let orderData: OrderData = { ingredients: ingredientIds };
      const response: {
        data: {
          name: string;
          order: {
            number: number;
          };
          success: boolean;
        };
      } = await axios.post(`${BASE_URL}/orders`, orderData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
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
    setCurrentIngredient: (
      state,
      action: PayloadAction<InitialState["currentIngredient"]>
    ) => {
      state.currentIngredient = action.payload;
    },
    setFilling: (state, action: PayloadAction<InitialState["filling"]>) => {
      state.filling = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
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
  fetchIngredients,
  makeOrder,
};
