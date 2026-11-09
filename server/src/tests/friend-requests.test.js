import { beforeEach, describe, expect, it, vi } from "vitest";

const { friendRequestFind } = vi.hoisted(() => ({
  friendRequestFind: vi.fn(),
}));

vi.mock("../models/friendRequest.model.js", () => ({
  default: {
    find: friendRequestFind,
  },
}));

vi.mock("../models/User.model.js", () => ({
  default: {},
}));

import { getFriendRequests } from "../controllers/user.controller.js";

describe("getFriendRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns populated incoming and outgoing pending requests", async () => {
    const incomingFriendRequests = [{ _id: "incoming-request" }];
    const outgoingFriendRequests = [{ _id: "outgoing-request" }];
    const incomingQuery = {
      populate: vi.fn().mockResolvedValue(incomingFriendRequests),
    };
    const outgoingQuery = {
      populate: vi.fn().mockResolvedValue(outgoingFriendRequests),
    };
    friendRequestFind
      .mockReturnValueOnce(incomingQuery)
      .mockReturnValueOnce(outgoingQuery);

    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getFriendRequests({ user: { id: "current-user" } }, response);

    expect(friendRequestFind).toHaveBeenNthCalledWith(1, {
      recipient: "current-user",
      status: "pending",
    });
    expect(incomingQuery.populate).toHaveBeenCalledWith(
      "sender",
      "name username avatar learningLanguage nativeLanguage location",
    );
    expect(friendRequestFind).toHaveBeenNthCalledWith(2, {
      sender: "current-user",
      status: "pending",
    });
    expect(outgoingQuery.populate).toHaveBeenCalledWith(
      "recipient",
      "name username avatar learningLanguage nativeLanguage location",
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: "Friend requests fetched successfully",
      incomingFriendRequests,
      outgoingFriendRequests,
    });
  });
});
