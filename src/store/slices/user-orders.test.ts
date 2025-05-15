jest.mock("../../utils/api", () => {
  const originalModule = jest.requireActual("../../utils/api");
  return {
    ...originalModule,
    fetchUserOrders: jest.fn(),
    refreshToken: jest.fn(),
  };
});

import { fetchUserOrders, refreshToken } from "../../utils/api";

import {
  connectUserOrders,
  initialState,
  userOrdersReducer,
  userOrdersActions,
} from "./user-orders";

describe("connectUserOrders thunk", () => {
  const dispatch = jest.fn();
  const rejectWithValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("успешное соединение", async () => {
    (fetchUserOrders as jest.Mock).mockResolvedValue({
      orders: ["order1", "order2"],
    });

    await connectUserOrders()(dispatch, () => {}, { rejectWithValue });

    expect(dispatch).toHaveBeenCalledWith(
      userOrdersActions.connectionEstablished()
    );
    expect(dispatch).toHaveBeenCalledWith(
      userOrdersActions.messageReceived(["order1", "order2"])
    );
  });

  it("ошибка при fetch, попытка повторить", async () => {
    (fetchUserOrders as jest.Mock)
      .mockRejectedValueOnce(new Error("error1"))
      .mockResolvedValueOnce({ orders: ["order1"] });

    await connectUserOrders()(dispatch, () => {}, { rejectWithValue });

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      userOrdersActions.connectionFailed("WebSocket error")
    );
    expect(dispatch).toHaveBeenCalledWith(
      userOrdersActions.messageReceived(["order1"])
    );
  });

  it("при ошибке в fetch, и повторных попытках не удаётся", async () => {
    (fetchUserOrders as jest.Mock)
      .mockRejectedValueOnce(new Error("error1"))
      .mockRejectedValueOnce(new Error("error2"));

    await connectUserOrders()(dispatch, () => {}, { rejectWithValue });

    expect(refreshToken).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      userOrdersActions.connectionFailed("WebSocket error")
    );
  });
});
describe("userOrdersSlice reducer", () => {
  it("корректно обрабатывает connectionEstablished", () => {
    const stateWithError = {
      ...initialState,
      error: "Previous error",
    };
    const state = userOrdersReducer(
      stateWithError,
      userOrdersActions.connectionEstablished()
    );
    expect(state.error).toBeUndefined();
  });
  it("pending устанавливает userOrdersPending = true", () => {
    const state = userOrdersReducer(initialState, {
      type: "userOrders/connect/pending",
    });
    expect(state.userOrdersPending).toBe(true);
  });
  it("корректно обрабатывает messageReceived", () => {
    const mockOrders = [{ id: 1, number: "123" }];
    const state = userOrdersReducer(
      initialState,
      userOrdersActions.messageReceived(mockOrders)
    );
    expect(state.userOrders).toEqual(mockOrders);
    expect(state.userOrdersPending).toBe(false);
  });

  it("корректно обрабатывает connectionFailed", () => {
    const errorMessage = "Connection failed";
    const state = userOrdersReducer(
      initialState,
      userOrdersActions.connectionFailed(errorMessage)
    );
    expect(state.error).toBe(errorMessage);
    expect(state.userOrdersPending).toBe(false);
  });

  it("корректно обрабатывает connectionClosed", () => {
    const state = userOrdersReducer(
      { ...initialState, userOrdersPending: true },
      userOrdersActions.connectionClosed()
    );
    expect(state.userOrdersPending).toBe(false);
  });
});
