import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function followUser(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: number;
  };

  const action = req.query.action;
  const followerId = decoded.userId;
  const followingId = Number(req.query.id);

  // --- getInfo (no auth changes needed) ---
  if (action === "getInfo") {
    const [followers, followings, followState] = await Promise.all([
      prisma.follow.findMany({ where: { followingId: followingId } }),
      prisma.follow.findMany({ where: { followerId: followingId } }),
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      }),
    ]);

    return res.json({
      followers: followers.length,
      followings: followings.length,
      state: !!followState,
    });
  }

  // --- follow / unfollow ---
  if (followerId === followingId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    if (action === "follow") {
      const follow = await prisma.follow.create({
        data: { followerId, followingId },
      });
      return res.status(201).json({ message: "Followed successfully", follow });
    } else if (action === "unfollow") {
      await prisma.follow.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      });
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (err: any) {
    if (err.code === "P2002")
      return res.status(400).json({ error: "Already following this user" });
    if (err.code === "P2025")
      return res.status(404).json({ error: "Follow relationship not found" });
    return res.status(500).json({ error: "Server error" });
  }
}
