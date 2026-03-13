import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { StarRating } from "./StarRating";
import { motion } from "framer-motion";

type Category = "books" | "movies" | "series" | "courses";

interface ReviewCardProps {
  id?: number;
  name: string;
  title: string;
  category: Category;
  rating: number;
  description: string;
  author: { name: string };
  likes?: number;
  comments?: number;
}

// Optimization: Define motion variants outside the component
// to prevent re-creating the object on every render.
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function ReviewCard({
  title,
  name,
  category, // Prepared for conditional styling if needed
  rating,
  description,
  author,
  likes = 0, // Optimization: Default values prevent "undefined" layout shifts
  comments = 0, // Optimization: Default values prevent "undefined" layout shifts
}: ReviewCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300"
    >
      <div className="p-5 space-y-4">
        {" "}
        {/* Optimization: Increased padding for better UI breathing room */}
        <div className="text-lg font-bold text-white tracking-tight leading-none">
          {name}
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground leading-snug">
            {title}
          </span>
          {/* Optimization: Flex-shrink-0 ensures the stars don't squash on small screens */}
          <div className="flex-shrink-0">
            <StarRating rating={rating} size="sm" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground/80 tracking-wide">
              {author.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label="Like"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-rose-500 transition-colors text-xs font-medium"
            >
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </button>

            <button
              aria-label="Comment"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </button>

            <button
              aria-label="Bookmark"
              className="text-muted-foreground hover:text-amber-400 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
