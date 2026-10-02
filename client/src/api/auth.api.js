import axiosInstance from "../lib/axios";

export const getAuthUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const signupUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

export const onboardingUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/onboarding", payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};
