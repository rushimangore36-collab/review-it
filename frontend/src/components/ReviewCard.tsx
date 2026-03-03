import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { StarRating } from "./StarRating";
import { CategoryBadge } from "./CategoryBadge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Category = "books" | "movies" | "series" | "courses";

interface ReviewCardProps {
  id?: string;
  coverImage: string;
  title: string;
  category: Category;
  rating: number;
  reviewText: string;
  author: { name: string; avatar: string };
  likes: number;
  comments: number;
}

export function ReviewCard({
  coverImage,
  title,
  category,
  rating,
  reviewText,
  author,
  likes,
  comments,
}: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={category} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link to="/item/1" className="font-display font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
            {title}
          </Link>
          <StarRating rating={rating} size="sm" />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {reviewText}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{author.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-category-movies transition-colors text-sm">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </button>
            <button className="text-muted-foreground hover:text-amber-400 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
