import { StreamChat } from "stream-chat";
// import dotenv from "dotenv";

// dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error(
    "Stream API key and secret must be set in environment variables.",
  );
  process.exit(1);
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    return await serverClient.upsertUsers([userData]);
  } catch (error) {
    console.error("Error upserting Stream user:", userData, error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const token = serverClient.createToken(userId.toString());
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating Stream token for userId:", userId, error);
  }
};
