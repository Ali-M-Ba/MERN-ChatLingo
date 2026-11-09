import axiosInstance from "../lib/axios";

export const getRecommendedUsers = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/recommended`);
    return data;
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    throw error;
  }
};

export const getFriends = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/friends`);
    return data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const sendFriendRequest = async (recipientId) => {
  try {
    const { data } = await axiosInstance.post(
      `/user/friend-requests/${recipientId}`,
    );
    return data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const cancelFriendRequest = async (recipientId) => {
  try {
    const { data } = await axiosInstance.post(
      `/user/friend-requests/${recipientId}/cancel`,
    );
    return data;
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (friendRequestId) => {
  try {
    const { data } = await axiosInstance.post(
      `/user/friend-requests/${friendRequestId}/accept`,
    );
    return data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const rejectFriendRequest = async (friendRequestId) => {
  try {
    const { data } = await axiosInstance.post(
      `/user/friend-requests/${friendRequestId}/reject`,
    );
    return data;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/friend-requests`);
    return data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

export const getRelationshipStatus = async (userId) => {
  try {
    const { data } = await axiosInstance.get(`/user/relationship/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching relationship status:", error);
    throw error;
  }
};
