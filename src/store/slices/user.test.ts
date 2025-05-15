import {
  authUser,
  initialState,
  loginUser,
  logOut,
  requestUserRegistration,
  updateInfoUser,
  userReducer,
  userSlice,
} from "./user";
import { auth, axiosInstance, updateInfo } from "../../utils/api";
import MockAdapter from "axios-mock-adapter";
import { configureStore } from "@reduxjs/toolkit";

describe("userSlice", () => {
  describe("extrareducers", () => {
    describe("requestUserRegistration", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
        localStorage.clear();
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен корректно обрабатывать успешную регистрацию", async () => {
        const mockResponse = {
          success: true,
          user: {
            email: "test@example.com",
            name: "Test User",
          },
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
        };

        mockAxios.onPost("/api/auth/register").reply(200, mockResponse);

        const store = configureStore({
          reducer: {
            user: userReducer,
          },
        });

        await store.dispatch(
          requestUserRegistration({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
          })
        );

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          registrationProcessing: false,
          email: "test@example.com",
          name: "Test User",
          errorRegistration: null,
        });

        expect(localStorage.getItem("accessToken")).toBe("test-access-token");
        expect(localStorage.getItem("refreshToken")).toBe("test-refresh-token");
      });

      it("должен обрабатывать ошибку регистрации", async () => {
        mockAxios.onPost("/api/auth/register").reply(403, {
          success: false,
          message: "User already exists",
        });

        const store = configureStore({
          reducer: {
            user: userReducer,
          },
        });

        await store.dispatch(
          requestUserRegistration({
            email: "existing@example.com",
            password: "password123",
            name: "Existing User",
          })
        );

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          registrationProcessing: false,
          errorRegistration: "error",
        });

        expect(localStorage.getItem("accessToken")).toBeNull();
      });

      it("должен устанавливать registrationProcessing = true при начале запроса", () => {
        const action = requestUserRegistration.pending("", {
          email: "test@example.com",
          password: "pass",
          name: "Test",
        });
        const state = userReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          registrationProcessing: true,
          errorRegistration: null,
        });
      });

      it("должен отклонять некорректный ответ сервера", async () => {
        mockAxios.onPost("/api/auth/register").reply(200, {
          success: true,
          invalidData: {},
        });

        const store = configureStore({ reducer: { user: userReducer } });
        await store.dispatch(
          requestUserRegistration({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
          })
        );

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          registrationProcessing: false,
          errorRegistration: "error",
        });
      });
    });
    describe("loginUser", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
        localStorage.clear();
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("успешный логин обновляет состояние и сохраняет токены", async () => {
        const mockResponse = {
          success: true,
          user: {
            email: "test@example.com",
            name: "Test User",
          },
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
        };

        mockAxios.onPost("/api/auth/login").reply(200, mockResponse);

        const store = configureStore({
          reducer: {
            user: userReducer,
          },
        });

        await store.dispatch(
          loginUser({
            email: "test@example.com",
            password: "password123",
          })
        );

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          email: "test@example.com",
          name: "Test User",
        });

        expect(localStorage.getItem("accessToken")).toBe("test-access-token");
        expect(localStorage.getItem("refreshToken")).toBe("test-refresh-token");
      });

      it("должен очищать токены при ошибке логина", async () => {
        localStorage.setItem("accessToken", "old-token");
        localStorage.setItem("refreshToken", "old-refresh-token");

        mockAxios.onPost("/api/auth/login").reply(401, {
          success: false,
          message: "Unauthorized",
        });

        const store = configureStore({
          reducer: {
            user: userReducer,
          },
        });

        await store.dispatch(
          loginUser({
            email: "wrong@example.com",
            password: "wrongpass",
          })
        );

        const state = store.getState().user;

        expect(state).toEqual(initialState);
        expect(localStorage.getItem("accessToken")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
      });
    });

    describe("authUser", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен возвращать данные пользователя при успешном запросе", async () => {
        const mockResponse = {
          success: true,
          user: { email: "user@example.com", name: "John" },
        };

        mockAxios.onGet("/api/auth/user").reply(200, mockResponse);

        const result = await auth();
        expect(result).toEqual(mockResponse);
      });

      it("fulfilled обновляет state", () => {
        const action = {
          type: authUser.fulfilled.type,
          payload: {
            success: true,
            user: { email: "a", name: "b" },
          },
        };
        const newState = userSlice.reducer(initialState, action);
        expect(newState).toEqual({
          ...initialState,
          email: "a",
          name: "b",
          isAuthChecked: true,
        });
      });

      it("rejected устанавливает isAuthChecked в true", () => {
        const action = {
          type: authUser.rejected.type,
        };
        const newState = userSlice.reducer(initialState, action);
        expect(newState).toEqual({
          ...initialState,
          isAuthChecked: true,
        });
      });
    });

    describe("updateInfoUser", () => {
      let mockAxios: MockAdapter;

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен обновлять имя пользователя", async () => {
        const mockResponse = {
          success: true,
          user: { email: "test@test.com", name: "New Name" },
        };

        mockAxios.onPatch("/api/auth/user").reply(200, mockResponse);

        const result = await updateInfo({
          name: "New Name",
          email: null,
          password: null,
        });
        expect(result).toEqual(mockResponse);
      });

      it("должен обновлять email пользователя", async () => {
        const mockResponse = {
          success: true,
          user: { email: "new@test.com", name: "Test User" },
        };

        mockAxios.onPatch("/api/auth/user").reply(200, mockResponse);

        const result = await updateInfo({
          email: "new@test.com",
          name: null,
          password: null,
        });
        expect(result.user.email).toBe("new@test.com");
      });

      it("должен возвращать ошибку при неверном пароле", async () => {
        mockAxios.onPatch("/api/auth/user").reply(400, {
          success: false,
          message: "Invalid password",
        });

        await expect(
          updateInfo({ password: "32323dda", email: null, name: null })
        ).rejects.toThrow("Request failed with status code 400");
      });

      it("должен обновлять данные пользователя в состоянии", async () => {
        const mockResponse = {
          success: true,
          user: { email: "old@test.com", name: "Updated Name" },
        };

        mockAxios.onPatch("/api/auth/user").reply(200, mockResponse);

        const store = configureStore({
          reducer: { user: userReducer },
          preloadedState: {
            user: {
              ...initialState,
              email: "old@test.com",
              name: "Old Name",
              isAuthChecked: true,
            },
          },
        });

        await store.dispatch(
          updateInfoUser({
            name: "Updated Name",
            email: null,
            password: null,
          })
        );

        const state = store.getState().user;
        expect(state).toEqual({
          ...initialState,
          name: "Updated Name",
          email: "old@test.com",
          isAuthChecked: true,
        });
      });

      it("должен сохранять старые данные при ошибке обновления", async () => {
        mockAxios.onPatch("/api/auth/user").reply(400);

        const store = configureStore({
          reducer: { user: userReducer },
          preloadedState: {
            user: {
              ...initialState,
              email: "old@test.com",
              name: "old name",
              isAuthChecked: true,
            },
          },
        });

        await store.dispatch(
          updateInfoUser({
            email: "new@test.com",
            name: null,
            password: null,
          })
        );

        const state = store.getState().user;
        expect(state).toEqual({
          ...initialState,
          email: "old@test.com",
          name: "old name",
          isAuthChecked: true,
        });
      });

      it("должен обновлять только имя при частичном обновлении", () => {
        const oldState = {
          ...initialState,
          email: "old@test.com",
          name: "Old",
          isAuthChecked: true,
        };
        const action = {
          type: updateInfoUser.fulfilled.type,
          payload: {
            success: true,
            user: { email: "old@test.com", name: "New Name" },
          },
        };

        const state = userReducer(oldState, action);
        expect(state).toEqual({
          ...initialState,
          name: "New Name",
          email: "old@test.com",
          isAuthChecked: true,
        });
      });

      it("должен обновлять только email при частичном обновлении", () => {
        const oldState = {
          ...initialState,
          email: "old@test.com",
          name: "Old",
          isAuthChecked: true,
        };
        const action = {
          type: updateInfoUser.fulfilled.type,
          payload: {
            success: true,
            user: { email: "new@test.com", name: "Old" },
          },
        };

        const state = userReducer(oldState, action);
        expect(state).toEqual({
          ...initialState,
          name: "Old",
          email: "new@test.com",
          isAuthChecked: true,
        });
      });
    });

    describe("logOut", () => {
      let mockAxios: MockAdapter;
      localStorage.setItem("accessToken", "test-access-token");
      localStorage.setItem("refreshToken", "test-refresh-token");

      beforeEach(() => {
        mockAxios = new MockAdapter(axiosInstance);
        localStorage.clear();
      });

      afterEach(() => {
        mockAxios.restore();
      });

      it("должен корректно обрабатывать успешный выход", async () => {
        mockAxios.onPost("/api/auth/logout").reply(200, {
          success: true,
          message: "Logged out",
        });

        const store = configureStore({
          reducer: { user: userReducer },
          preloadedState: {
            user: {
              ...initialState,
              email: "user@example.com",
              name: "John Doe",
              isAuthChecked: true,
            },
          },
        });

        await store.dispatch(logOut());

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          name: "",
          email: "",
          isAuthChecked: true,
        });

        expect(localStorage.getItem("accessToken")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
      });

      it("должен очищать данные даже при ошибке сервера", async () => {
        mockAxios.onPost("/api/auth/logout").reply(500);

        const store = configureStore({
          reducer: { user: userReducer },
          preloadedState: {
            user: {
              ...initialState,
              email: "user@example.com",
              name: "John Doe",
              isAuthChecked: true,
            },
          },
        });

        await store.dispatch(logOut());

        const state = store.getState().user;

        expect(state).toEqual({
          ...initialState,
          name: "",
          email: "",
          isAuthChecked: true,
        });

        expect(localStorage.getItem("accessToken")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
      });

      it("должен обрабатывать logOut.fulfilled", () => {
        const oldState = {
          ...initialState,
          email: "user@test.com",
          name: "Test User",
          isAuthChecked: true,
        };
        const action = {
          type: logOut.fulfilled.type,
          payload: { success: true, message: "Success" },
        };

        const state = userReducer(oldState, action);
        expect(state).toEqual({
          ...initialState,
          name: "",
          email: "",
          isAuthChecked: true,
        });
      });

      it("должен обрабатывать logOut.rejected", () => {
        const oldState = {
          ...initialState,
          email: "user@test.com",
          name: "Test User",
          isAuthChecked: true,
        };
        const action = {
          type: logOut.rejected.type,
        };

        const state = userReducer(oldState, action);
        expect(state).toEqual({
          ...initialState,
          name: "",
          email: "",
          isAuthChecked: true,
        });
      });
    });
  });
});
