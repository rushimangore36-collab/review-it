import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function getProfile(req: Request, res: Response) {
  try {
    const action = req.query.action;
    if (action === "profile") {
      const id = req.query.id;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          name: true,
          username: true,
        },
      });
      res.json(user);
    } else if (action === "search") {
      const q = req.query.q as string | undefined;
      if (!q?.trim()) {
        return res.json([]);
      }
      const users = await prisma.user.findMany({
        where: {
          name: { contains: q.trim(), mode: "insensitive" },
        },
        select: {
          id: true,
          username: true,
          name: true,
        },
        take: 10,
      });
      res.json(users);
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
