import { ordersWSReducer, initialState, loadOrdersWS } from "./orders-ws";
import { ordersWSActions } from "./orders-ws";
import { ordersMock } from "../../utils/mock";
import { configureStore } from "@reduxjs/toolkit";

const dispatch = jest.fn();
const getState = jest.fn();
jest.mock("../../utils/api");

describe("ordersWSSlice", () => {
  describe("loadOrdersWS ", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("корректно диспатчит экшены", async () => {
      await loadOrdersWS()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "orders/load/pending",
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("setOrdersWSPending"),
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("setOrdersWSError"),
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("messageReceivedWs"),
        })
      );
    });

    it("корректно обрабатывает успешное соединение", async () => {
      const mockData = {
        orders: [{ id: 1, number: "123" }],
        total: 100,
        totalToday: 5,
      };

      require("../../utils/api").fetchOrdersResponse.mockResolvedValue(
        mockData
      );

      const store = configureStore({
        reducer: {
          ordersWS: ordersWSReducer,
        },
      });

      await store.dispatch(loadOrdersWS());

      const state = store.getState().ordersWS;

      expect(state).toEqual({
        ...initialState,
        orders: mockData.orders,
        ordersWSPending: false,
        error: undefined,
        total: mockData.total,
        totalToday: mockData.totalToday,
      });
    });

    it("корректно обрабатывает ошибку соединения", async () => {
      const errorMessage = "WebSocket error";
      require("../../utils/api").fetchOrdersResponse.mockRejectedValue(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: {
          ordersWS: ordersWSReducer,
        },
      });

      await store.dispatch(loadOrdersWS());

      const state = store.getState().ordersWS;
      expect(state.error).toBe(errorMessage);
      expect(state.ordersWSPending).toBe(false);
    });
  });

  describe("reducers", () => {
    it("корректно обрабатывает setOrdersWSPending", () => {
      const state = ordersWSReducer(
        initialState,
        ordersWSActions.setOrdersWSPending(true)
      );

      expect(state).toEqual({ ...initialState, ordersWSPending: true });
    });

    it("корректно обрабатывает setOrdersWSError", () => {
      const error = "Connection error";
      const state = ordersWSReducer(
        initialState,
        ordersWSActions.setOrdersWSError(error)
      );
      expect(state).toEqual({ ...initialState, error: error });
    });

    it("корректно обрабатывает messageReceivedWs", () => {
      const state = ordersWSReducer(
        initialState,
        ordersWSActions.messageReceivedWs(ordersMock)
      );

      expect(state).toEqual({
        ...initialState,
        orders: ordersMock.orders,
        total: ordersMock.total,
        totalToday: ordersMock.totalToday,
        ordersWSPending: false,
      });
    });

    it("корректно обрабатывает connectionFailedWs", () => {
      const state = ordersWSReducer(
        initialState,
        ordersWSActions.connectionFailedWs("Failed to connect")
      );
      expect(state).toEqual({
        ...initialState,
        error: "Failed to connect",
        ordersWSPending: false,
      });
    });

    it("корректно обрабатывает connectionClosedWs", () => {
      const state = ordersWSReducer(
        { ...initialState, ordersWSPending: true },
        ordersWSActions.connectionClosedWs()
      );
      expect(state).toEqual({ ...initialState, ordersWSPending: false });
    });
  });
});
