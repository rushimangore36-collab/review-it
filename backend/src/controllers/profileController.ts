import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function getProfile(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  let userId: number;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,

        username: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}
