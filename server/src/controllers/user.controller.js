import mongoose from "mongoose";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/User.model.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const currentUserId = id.toString();

    const pendingFriendRequests = await FriendRequest.find({
      status: "pending",
      $or: [{ sender: id }, { recipient: id }],
    });

    const outgoingPendingRequests = pendingFriendRequests.filter(
      (request) => request.sender.toString() === currentUserId,
    );
    const incomingRequestsBySenderId = new Map(
      pendingFriendRequests
        .filter((request) => request.recipient.toString() === currentUserId)
        .map((request) => [request.sender.toString(), request]),
    );
    const excludedUserIds = new Set([
      currentUserId,
      ...user.friends.map((friendId) => friendId.toString()),
      ...outgoingPendingRequests.map((request) =>
        request.recipient.toString(),
      ),
    ]);

    const recommendedUsers = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
      isOnboarded: true,
    }).select("name username avatar learningLanguage nativeLanguage location");

    res.status(200).json({
      message: "Recommended users fetched successfully",
      recommendedUsers: recommendedUsers.map((recommendedUser) => {
        const incomingRequest = incomingRequestsBySenderId.get(
          recommendedUser._id.toString(),
        );

        return {
          ...recommendedUser.toObject(),
          relationshipStatus: incomingRequest ? "incoming_pending" : "none",
          ...(incomingRequest
            ? { friendRequestId: incomingRequest._id }
            : {}),
        };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recommended users" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id)
      .select("friends")
      .populate(
        "friends",
        "name username avatar learningLanguage nativeLanguage location",
      );
    const friends = user.friends.map((friend) => ({
      ...friend.toObject(),
      relationshipStatus: "friends",
    }));

    res.status(200).json({ message: "Friends fetched successfully", friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching friends" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const { id } = req.user;

    const [incomingFriendRequests, outgoingFriendRequests] = await Promise.all([
      FriendRequest.find({
        recipient: id,
        status: "pending",
      }).populate(
        "sender",
        "name username avatar learningLanguage nativeLanguage location",
      ),

      FriendRequest.find({
        sender: id,
        status: "pending",
      }).populate(
        "recipient",
        "name username avatar learningLanguage nativeLanguage location",
      ),
    ]);
    res.status(200).json({
      message: "Friend requests fetched successfully",
      incomingFriendRequests,
      outgoingFriendRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching friend requests",
    });
  }
};

export const getRelationshipStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.params;

    if (!userId || !id) {
      return res.status(400).json({
        message: "User ID and authenticated user ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const otherUserExists = await User.exists({ _id: userId });
    if (!otherUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const areFriends = await User.exists({
      _id: id,
      friends: userId,
    });
    if (areFriends) {
      return res.status(200).json({ relationshipStatus: "friends" });
    }

    const pendingRequest = await FriendRequest.findOne({
      status: "pending",
      $or: [
        { sender: id, recipient: userId },
        { sender: userId, recipient: id },
      ],
    }).select("sender");

    const relationshipStatus = pendingRequest
      ? pendingRequest.sender.toString() === id
        ? "outgoing_pending"
        : "incoming_pending"
      : "none";

    res.status(200).json({
      relationshipStatus,
      ...(relationshipStatus === "incoming_pending"
        ? { friendRequestId: pendingRequest._id }
        : {}),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching relationship status",
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { id } = req.user;
    const { recipientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({
        message: "Invalid recipient ID",
      });
    }

    if (id === recipientId) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    const alreadyFriends = await User.exists({
      _id: recipientId,
      friends: id,
    });
    if (alreadyFriends) {
      return res.status(400).json({
        message: "You are already friends with this user",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        {
          sender: id,
          recipient: recipientId,
        },
        {
          sender: recipientId,
          recipient: id,
        },
      ],
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "A pending friend request already exists",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: id,
      recipient: recipientId,
    });

    res
      .status(201)
      .json({ friendRequest, message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending friend request",
    });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { id } = req.user;
    const { recipientId } = req.params;

    if (!recipientId || !id) {
      return res.status(400).json({
        message: "Recipient ID and user ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(recipientId) ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid recipient ID or user ID",
      });
    }

    const friendRequest = await FriendRequest.findOne({
      sender: id,
      recipient: recipientId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.sender.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized to cancel this friend request",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: "This friend request has already been processed",
      });
    }

    await FriendRequest.findByIdAndDelete(friendRequest._id);
    res.status(200).json({ message: "Friend request cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.user;
    const { friendRequestId } = req.params;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: "This friend request has already been processed",
      });
    }

    // addToSet ensures that the friend is only added once,
    // preventing duplicates
    await User.findByIdAndUpdate(id, {
      $addToSet: { friends: friendRequest.sender },
    });
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: id },
    });

    await FriendRequest.findByIdAndUpdate(friendRequestId, {
      status: "accepted",
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { id } = req.user;
    const { friendRequestId } = req.params;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized to reject this friend request",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: "This friend request has already been processed",
      });
    }

    await FriendRequest.findByIdAndUpdate(friendRequestId, {
      status: "rejected",
    });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};
