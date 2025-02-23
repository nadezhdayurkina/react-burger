import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://norma.nomoreparties.space/api",
  headers: {
    Authorization: localStorage.getItem("accessToken"),
  },
});

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await axiosInstance.post("/auth/token", {
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
