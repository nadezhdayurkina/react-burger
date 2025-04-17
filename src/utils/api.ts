import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://norma.nomoreparties.space",
});

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await axiosInstance.post("/api/auth/token", {
    token: refreshToken,
  });

  if (response.data.success) {
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axiosInstance.defaults.headers["Authorization"] = accessToken?.toString();

    return accessToken;
  } else {
    throw new Error("Unable to refresh token");
  }
};

axiosInstance.interceptors.request.use((request) => {
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    request.headers.setAuthorization(accessToken);
  }

  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const errorMessage = error.response.data?.message;

      if (
        errorMessage &&
        errorMessage.includes("jwt expired") &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers["Authorization"] = newAccessToken;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          throw refreshError;
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function forgotPassword(email: string) {
  const { data } = await axiosInstance.post("/api/password-reset", { email });
  return data as {
    success: boolean;
    message: string;
  };
}

export async function resetPassword(password: string, token: string) {
  const { data } = await axiosInstance.post("/api/password-reset/reset", {
    password,
    token,
  });
  return data as {
    success: boolean;
    message: string;
  };
}

export async function userRegister(
  email: string,
  password: string,
  name: string
) {
  const { data } = await axiosInstance.post("/api/auth/register", {
    email,
    password,
    name,
  });

  return data as {
    success: boolean;
    user: {
      email: string;
      name: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(email: string, password: string) {
  const { data } = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });

  return data as {
    success: boolean;
    user: {
      email: string;
      name: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function auth() {
  const { data } = await axiosInstance.get("/api/auth/user", {});

  return data as {
    success: boolean;
    user: {
      email: string;
      name: string;
    };
  };
}

export async function updateInfo(userData: {
  email: string | null;
  password: string | null;
  name: string | null;
}) {
  const { data } = await axiosInstance.patch("/api/auth/user", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  return data as {
    success: boolean;
    user: {
      email: string;
      name: string;
    };
  };
}
