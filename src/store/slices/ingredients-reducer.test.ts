import {
  fetchOrderByNumber,
  ingredientsReducer,
  ingredientsSlice,
  InitialState,
  initialState,
  loadIngredients,
  makeOrder,
} from "./ingredients";

import { axiosInstance } from "../../utils/api";
import MockAdapter from "axios-mock-adapter";
import {
  ingredientsMock,
  mockBuns,
  mockFillings,
  mockOrderResponse,
  ordersMock,
} from "../../utils/mock";
import { configureStore } from "@reduxjs/toolkit";

describe("ingredientsSlice", () => {
  describe("reducers", () => {
    describe("setBun", () => {
      it("должен обновить поле bun", () => {
        const newState = ingredientsSlice.reducer(
          initialState,
          ingredientsSlice.actions.setBun(mockBuns[0])
        );

        expect(newState).toEqual({ ...initialState, bun: mockBuns[0] });
      });

      it("должен перезаписать bun, если он уже существует", () => {
        const oldState = { ...initialState, bun: mockBuns[1] };

        const newState = ingredientsSlice.reducer(
          oldState,
          ingredientsSlice.actions.setBun(mockBuns[2])
        );

        expect(newState).toEqual({ ...oldState, bun: mockBuns[2] });
      });
    });

    describe("addFilling", () => {
      it("должен добавить ингредиент в filling", () => {
        const newState = ingredientsSlice.reducer(
          initialState,
          ingredientsSlice.actions.addFilling(mockFillings[0])
        );

        expect(newState.filling).toContainEqual(mockFillings[0]);
      });
    });

    describe("clearOrder", () => {
      it("должен очистить конструктор заказа", () => {
        const oldState: InitialState = {
          ...initialState,
          bun: mockBuns[3],
          filling: [mockFillings[0]],
          order: {
            name: "Заказ",
            number: 123131313,
            success: true,
          },
        };

        const newState = ingredientsSlice.reducer(
          oldState,
          ingredientsSlice.actions.clearOrder()
        );

        expect(newState).toEqual(initialState);
      });
    });

    describe("setFilling", () => {
      it("должен перезаписать массив начинок", () => {
        const oldFilling = [mockFillings[1]];
        const newFilling = [mockFillings[2]];

        const oldState = { ...initialState, filling: oldFilling };

        const newState = ingredientsSlice.reducer(
          oldState,
          ingredientsSlice.actions.setFilling(newFilling)
        );
        expect(newState).toEqual({ ...initialState, filling: newFilling });
      });
    });
  });

  describe("extraReducers", () => {
    describe("loadIngredients", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен корректно обрабатывать успешную загрузку ингредиентов", async () => {
        mockAxios.onGet("/api/ingredients").reply(200, {
          data: [ingredientsMock[0], ingredientsMock[1]],
        });

        const store = configureStore({
          reducer: {
            ingredients: ingredientsReducer,
          },
        });

        await store.dispatch(loadIngredients());

        const state = store.getState().ingredients;
        expect(state.ingredients).toEqual([
          ingredientsMock[0],
          ingredientsMock[1],
        ]);
        expect(state.status).toBe("succeeded");
      });

      it("должен обрабатывать некорректный ответ API", async () => {
        mockAxios.onGet("/api/ingredients").reply(200, {
          data: "invalid_data",
        });

        const store = configureStore({
          reducer: { ingredients: ingredientsReducer },
        });

        await store.dispatch(loadIngredients());

        expect(store.getState().ingredients.status).toBe("failed");
      });

      it('устанавливает статус "loading", когда ожидается загрузка', () => {
        const action = { type: loadIngredients.pending.type };
        const state = ingredientsSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "loading",
        });
      });

      it('записывает данные в ingredients и устанавливает статус "succeeded" при успешной загрузке', () => {
        const oldState: InitialState = {
          ...initialState,
          status: "loading",
        };

        const action = {
          type: loadIngredients.fulfilled.type,
          payload: [ingredientsMock[0], ingredientsMock[1]],
        };

        const newState = ingredientsSlice.reducer(oldState, action);

        expect(newState).toEqual({
          ...initialState,
          ingredients: [ingredientsMock[0], ingredientsMock[1]],
          ingredientsById: {
            [ingredientsMock[0]._id]: ingredientsMock[0],
            [ingredientsMock[1]._id]: ingredientsMock[1],
          },
          bun: null,
          filling: [],
          status: "succeeded",
        });
      });

      it('устанавливает статус "failed" при ошибке загрузки', () => {
        const action = { type: loadIngredients.rejected.type };
        const state = ingredientsSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "failed",
        });
      });
    });

    describe("makeOrder", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен корректно обрабатывать успешное создание заказа", async () => {
        mockAxios.onPost("/api/orders").reply(200, mockOrderResponse);

        const store = configureStore({
          reducer: {
            ingredients: ingredientsReducer,
          },
        });

        await store.dispatch(makeOrder(ordersMock.orders[0].ingredients));

        const state = store.getState().ingredients;

        expect(state).toEqual({
          ...initialState,
          orderProcessing: false,
          order: {
            name: mockOrderResponse.name,
            number: mockOrderResponse.order.number,
            success: mockOrderResponse.success,
          },
          errorOrder: null,
        });
      });

      it("должен обрабатывать ошибку создания заказа", async () => {
        mockAxios.onPost("/api/orders").reply(500);

        const store = configureStore({
          reducer: { ingredients: ingredientsReducer },
        });

        await store.dispatch(makeOrder(["ingredient1"]));

        const state = store.getState().ingredients;
        expect(state.orderProcessing).toBe(false);
        expect(state.errorOrder).not.toBeNull();
      });

      it("устанавливает orderProcessing = true, когда ожидается загрузка", () => {
        const newState = ingredientsSlice.reducer(initialState, {
          type: makeOrder.pending.type,
        });

        expect(newState).toEqual({
          ...initialState,
          orderProcessing: true,
        });
      });

      it("записывает данные в order, устанавливает orderProcessing = false, errorOrder = null при успешной загрузке", () => {
        const oldState: InitialState = {
          ...initialState,
          orderProcessing: true,
          errorOrder: "error",
        };

        const newState = ingredientsSlice.reducer(oldState, {
          type: makeOrder.fulfilled.type,
          payload: {
            name: "Заказ",
            order: {
              number: 10355,
            },
            success: true,
          },
        });

        expect(newState).toEqual({
          ...initialState,
          orderProcessing: false,
          order: {
            name: "Заказ",
            number: 10355,
            success: true,
          },
          errorOrder: null,
        });
      });

      it("записывает ошибку в errorOrder и устанавливает orderProcessing = false при ошибке загрузки", () => {
        const newState = ingredientsSlice.reducer(initialState, {
          type: makeOrder.rejected.type,
          payload: "error",
        });

        expect(newState).toEqual({
          ...initialState,
          orderProcessing: false,
          errorOrder: "error",
        });
      });
    });

    describe("fetchOrderByNumber", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен корректно обрабатывать успешный запрос заказа", async () => {
        mockAxios.onGet(`/api/orders/0`).reply(200, {
          success: true,
          orders: [ordersMock.orders[0]],
        });

        const store = configureStore({
          reducer: { ingredients: ingredientsReducer },
        });

        await store.dispatch(
          fetchOrderByNumber(ordersMock.orders[0].number.toString())
        );

        const state = store.getState().ingredients;
        expect(state.currentOrder.data).toEqual(ordersMock.orders[0]);
        expect(state.currentOrder.loading).toBe(false);
        expect(state.currentOrder.error).toBeNull();
      });

      it("устанавливает в currentOrder следующие значения: loading = true, error = null, когда ожидается загрузка", () => {
        const newState = ingredientsSlice.reducer(initialState, {
          type: fetchOrderByNumber.pending.type,
        });

        expect(newState).toEqual({
          ...initialState,
          currentOrder: {
            data: null,
            loading: true,
            error: null,
          },
        });
      });

      it("устанавливает в currentOrder данные в data и loading = false в случае успешной загрузки", () => {
        const oldState: InitialState = {
          ...initialState,
          currentOrder: {
            data: null,
            loading: true,
            error: null,
          },
        };

        const newState = ingredientsSlice.reducer(oldState, {
          type: fetchOrderByNumber.fulfilled.type,
          payload: ordersMock.orders[0],
        });

        expect(newState).toEqual({
          ...initialState,
          currentOrder: {
            data: ordersMock.orders[0],
            loading: false,
            error: null,
          },
        });
      });
    });
  });
});
