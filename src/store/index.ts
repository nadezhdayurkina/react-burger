import { configureStore, bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ingredientsActions, ingredientsReducer } from "./slices/ingredients";
import { userActions, userReducer } from "./slices/user";
import { userOrdersActions, userOrdersReducer } from "./slices/user-orders";
import { ordersWSActions, ordersWSReducer } from "./slices/orders-ws";

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userReducer,
    userOrders: userOrdersReducer,
    ordersWS: ordersWSReducer,
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

export const useUserStore = () => {
  return {
    ...useAppSelector((state) => state.user),
    ...bindActionCreators(userActions, useDispatch()),
  };
};

export const useUserOrdersStore = () => {
  return {
    ...useAppSelector((state) => state.userOrders),
    ...bindActionCreators(userOrdersActions, useDispatch()),
  };
};

export const useOrdersWSStore = () => {
  return {
    ...useAppSelector((state) => state.ordersWS),
    ...bindActionCreators(ordersWSActions, useDispatch()),
  };
};
