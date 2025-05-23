import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  auth,
  axiosInstance,
  login,
  updateInfo,
  userRegister,
} from "../../utils/api";

interface InitialState {
  email: string;
  password: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  errorRegistration: string | null | unknown;
  registrationProcessing: boolean;
  passwordToken: string;
  isAuthChecked: boolean;
}

const initialState: InitialState = {
  email: "",
  password: "",
  name: "",
  accessToken: "",
  refreshToken: "",
  errorRegistration: null,
  registrationProcessing: false,
  passwordToken: "",
  isAuthChecked: false,
};

export const requestUserRegistration = createAsyncThunk(
  "user/register",
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const data = await userRegister(email, password, name);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }) => {
    const data = await login(email, password);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  }
);

export const authUser = createAsyncThunk("auth/user", async () => {
  let data = await auth();
  return data;
});

export const updateInfoUser = createAsyncThunk(
  "auth/user/update",
  async (userData: {
    email: string | null;
    password: string | null;
    name: string | null;
  }) => {
    const data = await updateInfo({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return data;
  }
);

export const logOut = createAsyncThunk("auth/logout", async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const { data } = await axiosInstance.post("/api/auth/logout", {
    token: refreshToken,
  });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return data as {
    success: boolean;
    message: string;
  };
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestUserRegistration.pending, (state) => {
        state.registrationProcessing = true;
      })
      .addCase(requestUserRegistration.fulfilled, (state, action) => {
        state.registrationProcessing = false;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(requestUserRegistration.rejected, (state) => {
        state.registrationProcessing = false;
        state.errorRegistration = "error";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })

      .addCase(authUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.isAuthChecked = true;
      })
      .addCase(authUser.rejected, (state) => {
        state.isAuthChecked = true;
      })

      .addCase(updateInfoUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })

      .addCase(logOut.fulfilled, (state) => {
        state.email = "";
        state.name = "";
      });
  },
});

export const userReducer = userSlice.reducer;
export const userActions = {
  ...userSlice.actions,
  requestUserRegistration,
  loginUser,
  authUser,
  updateInfoUser,
  logOut,
};
