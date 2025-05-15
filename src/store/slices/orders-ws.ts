import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrdersResponse } from "../../utils/api";

export interface InitialState {
  ordersWSPending?: boolean;
  orders: OrderApi[];
  total: number;
  totalToday: number;
  error?: string;
}

export const initialState: InitialState = {
  ordersWSPending: undefined,
  orders: [],
  total: 0,
  totalToday: 0,
};

export interface OrderApi {
  ingredients: string[];
  _id: string;
  status: "created" | "pending" | "done" | "cancelled";
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: OrderApi[];
  total: number;
  totalToday: number;
}

export const loadOrdersWS = createAsyncThunk(
  "orders/load",
  async (_, { dispatch }) => {
    dispatch(ordersWSSlice.actions.setOrdersWSPending(true));
    dispatch(ordersWSSlice.actions.setOrdersWSError(undefined));

    try {
      let data = (await fetchOrdersResponse()) as OrdersResponse;
      dispatch(ordersWSSlice.actions.messageReceivedWs(data));
    } catch (e) {
      dispatch(ordersWSSlice.actions.setOrdersWSError((e as Error)?.message));
    } finally {
      dispatch(ordersWSSlice.actions.setOrdersWSPending(false));
    }
  }
);

export const ordersWSSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    setOrdersWSPending: (state, action: PayloadAction<boolean>) => {
      state.ordersWSPending = action.payload;
    },
    setOrdersWSError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    messageReceivedWs: (state, action: PayloadAction<OrdersResponse>) => {
      state.orders = action.payload?.orders;
      state.total = action.payload?.total || 0;
      state.totalToday = action.payload?.totalToday || 0;
      state.ordersWSPending = false;
    },
    connectionFailedWs: (state, action) => {
      state.error = action.payload;
      state.ordersWSPending = false;
    },
    connectionClosedWs: (state) => {
      state.ordersWSPending = false;
    },
  },
});

export const ordersWSReducer = ordersWSSlice.reducer;
export const ordersWSActions = {
  ...ordersWSSlice.actions,
  loadOrdersWS,
};
