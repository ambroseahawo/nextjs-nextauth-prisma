import { Request, Response } from "express";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import redis from "../redis/redisClient";

const SESSION_EXPIRY = 2 * 60 * 60; // 2 hours in seconds

// create and store session in redis
export const createSession = async (userId: string, res: Response): Promise<void> => {
  const sessionId = uuidv4();
  const sessionData = JSON.stringify({ userId, createdAt: Date.now() });

  // store session in redis with expiration
  await redis.set(`session:${sessionId}`, sessionData, "EX", SESSION_EXPIRY);

  // set session ID as a secure, HTTP-only cookie
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_EXPIRY * 1000,
  });
};

const getSessionFromRedis = promisify(redis.get).bind(redis);

export const getSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ message: "No session found" });
    }

    // Check session in Redis
    const sessionData = await getSessionFromRedis(sessionId);
    if (!sessionData) {
      return res.status(401).json({ message: "Session expired" });
    }
    const parsedSessionData = JSON.parse(sessionData);

    res.status(200).json({ userId: parsedSessionData.userId });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate session and handle rolling expiration
export const validateSession = async (req: Request): Promise<string | null> => {
  const { sessionId } = req.cookies; // Using cookie-parser for this
  if (!sessionId) return null;

  const sessionKey = `session:${sessionId}`;
  const sessionData = await redis.get(sessionKey);
  if (!sessionData) return null;

  // Extend session expiration (rolling session)
  await redis.expire(sessionKey, SESSION_EXPIRY);

  // Parse session data
  const { userId } = JSON.parse(sessionData);
  return userId;
};

// For rolling session, you can extend the TTL on every request if necessary:
export const extendSessionTTL = async (sessionId: string) => {
  await redis.expire(`session:${sessionId}`, SESSION_EXPIRY); // Reset the expiration
};

// Destroy session (logout)
export const destroySession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await redis.del(`session:${sessionId}`);
    res.clearCookie("sessionId");
  }
};
