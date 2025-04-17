import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";

export interface InitialState {
  ordersWSPending?: boolean;
  orders: OrderApi[];
  total: number;
  totalToday: number;
  socketConnected: boolean;
  error?: string;
}

const initialState: InitialState = {
  ordersWSPending: undefined,
  orders: [],
  total: 0,
  totalToday: 0,
  socketConnected: false,
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

interface OrdersResponse {
  success: boolean;
  orders: OrderApi[];
  total: number;
  totalToday: number;
}

export const useWebSocket = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("norma.nomoreparties.space/orders/all");

    socket.onopen = () => {
      console.log("WebSocket подключен");
    };

    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    socket.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, ["norma.nomoreparties.space/orders/all"]);

  return data;
};

export const loadOrdersWS = createAsyncThunk(
  "orders/load",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(ordersWSSlice.actions.setOrdersWSPending(true));

    try {
      const socket = new WebSocket(
        `wss://norma.nomoreparties.space/orders/all`
      );

      socket.onopen = () => {
        dispatch(ordersWSSlice.actions.connectionEstablishedWs());
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as OrdersResponse;
          dispatch(ordersWSSlice.actions.messageReceivedWs(data));
        } catch (e) {
          console.error("Ошибка парсинга данных", e);
        }
      };

      socket.onerror = (error) => {
        dispatch(ordersWSSlice.actions.connectionFailedWs("WebSocket error"));
      };

      socket.onclose = (event) => {
        if (!event.wasClean) {
          dispatch(
            ordersWSSlice.actions.connectionFailedWs(
              "Connection closed unexpectedly"
            )
          );
        }
      };
    } catch (error) {
      return rejectWithValue("Failed to connect");
    } finally {
      dispatch(ordersWSSlice.actions.setOrdersWSPending(false));
    }
  }
);

const ordersWSSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    setOrdersWSPending: (state, action: PayloadAction<boolean>) => {
      state.ordersWSPending = action.payload;
    },
    connectionEstablishedWs: (state) => {
      state.socketConnected = true;
      state.error = undefined;
    },
    messageReceivedWs: (state, action: PayloadAction<OrdersResponse>) => {
      state.orders = action.payload?.orders;
      state.total = action.payload?.total || 0;
      state.totalToday = action.payload?.totalToday || 0;
      state.ordersWSPending = false;
    },
    connectionFailedWs: (state, action) => {
      state.socketConnected = false;
      state.error = action.payload;
      state.ordersWSPending = false;
    },
    connectionClosedWs: (state) => {
      state.socketConnected = false;
      state.ordersWSPending = false;
    },
  },
});

export const ordersWSReducer = ordersWSSlice.reducer;
export const ordersWSActions = {
  ...ordersWSSlice.actions,
  loadOrdersWS,
};
