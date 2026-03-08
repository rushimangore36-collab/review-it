import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { category, name, title, rating, description } = req.body;
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    const authorId = decoded.userId;

    const review = await prisma.review.create({
      data: {
        category,
        name,
        title,
        rating,
        description,
        author: {
          connect: { id: authorId },
        },
      },
    });

    res.status(201).json({ message: "Review created successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        category: true,
        name: true,
        title: true,
        rating: true,
        description: true,
        author: {
          select: { name: true },
        },
      },
    });
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        category: true,
        name: true,
        title: true,
        rating: true,
        description: true,
        author: {
          select: { name: true },
        },
      },
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.status(200).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
