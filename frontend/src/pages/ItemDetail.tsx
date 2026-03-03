import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Bookmark, Share2, PenLine } from "lucide-react";
import { Link } from "react-router-dom";

const ratingBreakdown = [
  { stars: 5, count: 1842, pct: 62 },
  { stars: 4, count: 720, pct: 24 },
  { stars: 3, count: 268, pct: 9 },
  { stars: 2, count: 98, pct: 3 },
  { stars: 1, count: 42, pct: 2 },
];

const userReviews = [
  {
    coverImage: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=600&h=340&fit=crop",
    title: "A cinematic triumph that redefines sci-fi",
    category: "movies" as const,
    rating: 5,
    reviewText: "Villeneuve proves once again that he's the master of epic sci-fi. Every frame is a painting, and the emotional depth of the story surpasses the previous installments.",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
    likes: 234,
    comments: 45,
  },
  {
    coverImage: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=600&h=340&fit=crop",
    title: "Good but not as good as Part Two",
    category: "movies" as const,
    rating: 4,
    reviewText: "While the visuals are incredible and the performances strong, I felt the pacing lagged in the middle. Still a must-watch and a fitting conclusion.",
    author: { name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    likes: 189,
    comments: 32,
  },
];

const similar = [
  { title: "Blade Runner 2049", cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&h=280&fit=crop", rating: 4.5 },
  { title: "Arrival", cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=280&fit=crop", rating: 4.6 },
  { title: "Interstellar", cover: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=200&h=280&fit=crop", rating: 4.8 },
  { title: "Tenet", cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=280&fit=crop", rating: 4.0 },
];

export default function ItemDetail() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1400&h=600&fit=crop"
          alt="Dune: Part Three"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <CategoryBadge category="movies" size="md" />
                <span className="text-sm text-muted-foreground">2026</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Dune: Part Three</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={5} size="md" />
                  <span className="font-semibold text-lg">4.7</span>
                  <span className="text-sm text-muted-foreground">(2,970 reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {["Sci-Fi", "Epic", "Drama", "Action", "Adaptation"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                The epic conclusion to Denis Villeneuve's adaptation of Frank Herbert's science fiction masterpiece.
                Paul Atreides unites with the Fremen in a climactic battle for the fate of the known universe, while
                struggling with the terrible future he has foreseen. A visual and emotional tour de force that brings
                one of literature's greatest sagas to a definitive end.
              </p>

              <div className="flex items-center gap-3 mb-12">
                <Button asChild className="rounded-xl gradient-primary text-primary-foreground border-0 gap-2">
                  <Link to="/write"><PenLine className="w-4 h-4" /> Write Review</Link>
                </Button>
                <Button variant="outline" className="rounded-xl gap-2">
                  <Bookmark className="w-4 h-4" /> Save
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Reviews */}
              <h2 className="font-display text-2xl font-bold mb-6">User Reviews</h2>
              <div className="space-y-4">
                {userReviews.map((review, i) => (
                  <ReviewCard key={i} {...review} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Rating Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-3">
                    <span className="text-sm w-3 text-right">{r.stars}</span>
                    <StarRating rating={r.stars} size="sm" />
                    <Progress value={r.pct} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Similar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold mb-4">If You Liked This</h3>
              <div className="grid grid-cols-2 gap-3">
                {similar.map((item) => (
                  <Link key={item.title} to="/item/1" className="group">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                    <StarRating rating={Math.round(item.rating)} size="sm" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
