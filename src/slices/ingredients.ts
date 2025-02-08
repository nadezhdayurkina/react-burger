import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

interface InitialState {
  ingredients: IngredientItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  currentIngredient: IngredientItem | null;
  bun: IngredientItem | null;
  filling: IngredientItem[];
}

const initialState: InitialState = {
  ingredients: [],
  status: "idle",
  currentIngredient: null,
  bun: null,
  filling: [],
};

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<InitialState["bun"]>) => {
      state.bun = action.payload;
    },
    addFilling: (state, action: PayloadAction<IngredientItem>) => {
      state.filling = [...state.filling, action.payload];
    },
    clearOrder: (state) => {
      state.filling = [];
      state.bun = null;
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
      });
  },
});

export const fetchIngredients = createAsyncThunk(
  "fetchIngredients",
  async () => {
    const { data } = await axios.get(
      "https://norma.nomoreparties.space/api/ingredients"
    );
    return data.data;
  }
);

export const ingredientsReducer = ingredientsSlice.reducer;
export const ingredientsActions = {
  ...ingredientsSlice.actions,
  fetchIngredients,
};
