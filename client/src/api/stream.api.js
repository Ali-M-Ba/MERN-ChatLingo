import axiosInstance from "@/lib/axios";

export const getStreamToken = async () => {
  try {
    const { data } = await axiosInstance.post("/chat/token");
    return data;
  } catch (error) {
    console.error("Error fetching stream token:", error);
    throw error;
  }
};
