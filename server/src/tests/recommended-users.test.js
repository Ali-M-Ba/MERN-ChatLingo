import { beforeEach, describe, expect, it, vi } from "vitest";

const { friendRequestFind, userFind, userFindById } = vi.hoisted(() => ({
  friendRequestFind: vi.fn(),
  userFind: vi.fn(),
  userFindById: vi.fn(),
}));

vi.mock("../models/friendRequest.model.js", () => ({
  default: {
    find: friendRequestFind,
  },
}));

vi.mock("../models/User.model.js", () => ({
  default: {
    find: userFind,
    findById: userFindById,
  },
}));

import {
  getFriends,
  getRecommendedUsers,
} from "../controllers/user.controller.js";

describe("getRecommendedUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes the relationship status and incoming request ID", async () => {
    const currentUserId = "current-user";
    const outgoingRecipientId = "outgoing-recipient";
    const incomingSenderId = "incoming-sender";
    const incomingRequestId = "incoming-request";
    const recommendedUsers = [
      {
        _id: { toString: () => "unrelated-user" },
        toObject: () => ({ _id: "unrelated-user", name: "Unrelated" }),
      },
      {
        _id: { toString: () => incomingSenderId },
        toObject: () => ({ _id: incomingSenderId, name: "Incoming" }),
      },
    ];

    userFindById.mockResolvedValue({ friends: [] });
    friendRequestFind.mockResolvedValue([
      {
        sender: { toString: () => currentUserId },
        recipient: { toString: () => outgoingRecipientId },
      },
      {
        _id: incomingRequestId,
        sender: { toString: () => incomingSenderId },
        recipient: { toString: () => currentUserId },
      },
    ]);
    userFind.mockReturnValue({
      select: vi.fn().mockResolvedValue(recommendedUsers),
    });

    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getRecommendedUsers({ user: { id: currentUserId } }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(userFind).toHaveBeenCalledWith({
      _id: {
        $nin: expect.arrayContaining([currentUserId, outgoingRecipientId]),
      },
      isOnboarded: true,
    });
    expect(response.json).toHaveBeenCalledWith({
      message: "Recommended users fetched successfully",
      recommendedUsers: [
        {
          _id: "unrelated-user",
          name: "Unrelated",
          relationshipStatus: "none",
        },
        {
          _id: incomingSenderId,
          name: "Incoming",
          relationshipStatus: "incoming_pending",
          friendRequestId: incomingRequestId,
        },
      ],
    });
  });
});

describe("getFriends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns friends with the friends relationship status", async () => {
    const friends = [
      {
        toObject: () => ({ _id: "friend-user", name: "Friend" }),
      },
    ];
    const userQuery = {
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue({ friends }),
    };
    userFindById.mockReturnValue(userQuery);

    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getFriends({ user: { id: "current-user" } }, response);

    expect(userFindById).toHaveBeenCalledWith("current-user");
    expect(userQuery.select).toHaveBeenCalledWith("friends");
    expect(userQuery.populate).toHaveBeenCalledWith(
      "friends",
      "name username avatar learningLanguage nativeLanguage location",
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: "Friends fetched successfully",
      friends: [
        {
          _id: "friend-user",
          name: "Friend",
          relationshipStatus: "friends",
        },
      ],
    });
  });
});
