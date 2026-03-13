import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserScalarFieldEnum } from "../../generated/prisma/internal/prismaNamespace";

export async function followUser(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: number;
  };

  const action = req.query.action;
  if (action === "getInfo") {
    const id = req.query.id;
    const followers = await prisma.follow.findMany({
      where: {
        followingId: Number(id),
      },
    });
    const followings = await prisma.follow.findMany({
      where: {
        followerId: Number(id),
      },
    });
    res.json({ followers: followers.length, followings: followings.length });
  }

  const followerId = decoded.userId;
  const followingId = Number(req.query.id);
  try {
    const follow = await prisma.follow.create({
      data: { followerId, followingId },
    });
    res.status(201).json({ message: "Followed successfully", follow });
  } catch (err: any) {
    if (err.code === "P2002")
      // Prisma unique constraint violation
      return res.status(400).json({ error: "Already following this user" });
    res.status(500).json({ error: "Server error" });
  }
}
