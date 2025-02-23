import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { axiosInstance } from "../utils/api";

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

type UserRegistrationResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
};

type LoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
};

export const requestUserRegistration = createAsyncThunk(
  "user/register",
  async (userData: { email: string; password: string; name: string }) => {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, userData);
    return data.data as UserRegistrationResponse;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData: { email: string; password: string }) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, userData);
    return data as LoginResponse;
  }
);

export const authUser = createAsyncThunk("auth/user", async () => {
  let { data } = await axiosInstance.get("/auth/user", {
    // headers: {
    //   Authorization: localStorage.getItem("accessToken"),
    // },
  });
  return data as {
    success: boolean;
    user: {
      email: string;
      name: string;
    };
  };
});

export const updateInfoUser = createAsyncThunk(
  "auth/user/update",
  async (userData: {
    accessToken: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
  }) => {
    const { data } = await axios.patch(
      `${BASE_URL}/auth/user`,
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
      {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }
    );
    return data as {
      success: boolean;
      user: {
        email: string;
        name: string;
      };
    };
  }
);

export const logOut = createAsyncThunk("auth/logout", async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const { data } = await axios.post(`${BASE_URL}/auth/logout`, {
    token: refreshToken,
  });
  return data as {
    success: boolean;
    message: string;
  };
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.passwordToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestUserRegistration.pending, (state) => {
        state.registrationProcessing = true;
      })
      .addCase(requestUserRegistration.fulfilled, (state, action) => {
        state.registrationProcessing = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(requestUserRegistration.rejected, (state) => {
        state.errorRegistration = "error";
      })

      .addCase(loginUser.pending, (state) => {})
      .addCase(loginUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state) => {})

      .addCase(authUser.pending, (state) => {})
      .addCase(authUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(authUser.rejected, (state) => {})

      .addCase(updateInfoUser.pending, (state) => {})
      .addCase(updateInfoUser.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(updateInfoUser.rejected, (state) => {})

      .addCase(logOut.pending, (state) => {})
      .addCase(logOut.fulfilled, (state, action) => {
        state.email = "";
        state.name = "";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logOut.rejected, (state) => {});
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
