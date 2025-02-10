import { configureStore, bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ingredientsActions, ingredientsReducer } from "./slices/ingredients";

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
  },
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

export const useIngredientsStore = () => {
  return {
    ...useAppSelector((state) => state.ingredients),
    ...bindActionCreators(ingredientsActions, useDispatch()),
  };
};
