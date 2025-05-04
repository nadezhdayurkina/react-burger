import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserOrders, refreshToken } from "../../utils/api";

export interface InitialState {
  userOrdersPending?: boolean;
  userOrders: OrderApi[];
  error?: string;
}

const initialState: InitialState = {
  userOrdersPending: undefined,
  userOrders: [],
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

export const connectUserOrders = createAsyncThunk(
  "userOrders/connect",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let loadCount = 0;
      let load = async () => {
        dispatch(userOrdersActions.connectionEstablished());

        let data = (await fetchUserOrders().catch(() => {
          if (loadCount < 2) {
            refreshToken();
            loadCount++;
            load();
          }

          dispatch(userOrdersActions.connectionFailed("WebSocket error"));
        })) as OrdersResponse;

        dispatch(userOrdersActions.messageReceived(data.orders || []));
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
      state.error = undefined;
    },
    messageReceived: (state, action) => {
      state.userOrders = action.payload;
      state.userOrdersPending = false;
    },
    connectionFailed: (state, action) => {
      state.error = action.payload;
      state.userOrdersPending = false;
    },
    connectionClosed: (state) => {
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
