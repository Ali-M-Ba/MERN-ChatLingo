import express from "express";
import {
  getRecommendedUsers,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(isAuth); // Apply authentication middleware to all routes in this router

router.get("/recommended", getRecommendedUsers);
router.get("/friends", getFriends);
router.get("/friend-requests", getFriendRequests);

router.post("/friend-requests/:recipientId", sendFriendRequest);
router.post("/friend-requests/:recipientId/cancel", cancelFriendRequest);
router.post("/friend-requests/:friendRequestId/accept", acceptFriendRequest);
router.post("/friend-requests/:friendRequestId/reject", rejectFriendRequest);

export default router;
