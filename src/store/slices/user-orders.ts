import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { refreshToken } from "../../utils/api";

export interface InitialState {
  userOrdersPending?: boolean;
  userOrders: OrderApi[];
  socketConnected: boolean;
  error?: string;
}

const initialState: InitialState = {
  userOrdersPending: undefined,
  userOrders: [],
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
    const socket = new WebSocket("norma.nomoreparties.space/orders");

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
  }, ["norma.nomoreparties.space/orders"]);

  return data;
};

export const connectUserOrders = createAsyncThunk(
  "userOrders/connect",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let loadCount = 0;
      let load = () => {
        const accessToken =
          localStorage.getItem("accessToken")?.replace(/^Bearer\s+/i, "") ?? "";

        const socket = new WebSocket(
          `wss://norma.nomoreparties.space/orders?token=${accessToken}`
        );

        socket.onopen = () => {
          dispatch(userOrdersActions.connectionEstablished());
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch(userOrdersActions.messageReceived(data.orders || []));
          } catch (e) {
            console.error("Ошибка парсинга данных", e);
          }
        };

        socket.onerror = (error) => {
          if (loadCount < 2) {
            refreshToken();
            loadCount++;
            load();
          }

          dispatch(userOrdersActions.connectionFailed("WebSocket error"));
        };

        socket.onclose = (event) => {
          if (!event.wasClean) {
            dispatch(
              userOrdersActions.connectionFailed(
                "Connection closed unexpectedly"
              )
            );
          }
        };
      };

      load();
    } catch (error) {
      return rejectWithValue("Failed to connect");
    }
  }
);

const userOrdersSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    connectionEstablished: (state) => {
      state.socketConnected = true;
      state.error = undefined;
    },
    messageReceived: (state, action) => {
      state.userOrders = action.payload;
      state.userOrdersPending = false;
    },
    connectionFailed: (state, action) => {
      state.socketConnected = false;
      state.error = action.payload;
      state.userOrdersPending = false;
    },
    connectionClosed: (state) => {
      state.socketConnected = false;
      state.userOrdersPending = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectUserOrders.pending, (state) => {
      state.userOrdersPending = true;
    });
  },
});

export const userOrdersReducer = userOrdersSlice.reducer;
export const userOrdersActions = {
  ...userOrdersSlice.actions,
  connectUserOrders,
};
