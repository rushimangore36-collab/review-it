import { Navbar } from "@/components/Navbar";
import { ReviewCard } from "@/components/ReviewCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp, Users, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const feedReviews = [
  {
    coverImage: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=600&h=340&fit=crop",
    title: "Dune: Part Three — A Visual Masterpiece",
    category: "movies" as const,
    rating: 5,
    reviewText: "Villeneuve has outdone himself yet again. The third installment brings the saga to a breathtaking conclusion with stunning visuals and powerful performances.",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
    likes: 234,
    comments: 45,
  },
  {
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=340&fit=crop",
    title: "The Midnight Library — A Comfort Read",
    category: "books" as const,
    rating: 4,
    reviewText: "Matt Haig delivers a thoughtful exploration of parallel lives. While the concept isn't new, the execution is heartwarming and deeply personal.",
    author: { name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    likes: 189,
    comments: 32,
  },
  {
    coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=340&fit=crop",
    title: "Severance S3 — Mind-Bending Television",
    category: "series" as const,
    rating: 5,
    reviewText: "The best show on television right now. Season 3 raises the stakes and delivers jaw-dropping revelations that will leave you speechless.",
    author: { name: "Aisha Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
    likes: 312,
    comments: 78,
  },
  {
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
    title: "AI Fundamentals — Worth Every Minute",
    category: "courses" as const,
    rating: 4,
    reviewText: "An excellent introduction to AI concepts. Well-structured modules with practical exercises. Perfect for beginners looking to break into the field.",
    author: { name: "David Kim", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" },
    likes: 156,
    comments: 23,
  },
];

const trendingItems = [
  { title: "Oppenheimer", rating: 4.6, category: "movies" as const },
  { title: "Atomic Habits", rating: 4.8, category: "books" as const },
  { title: "The Bear S4", rating: 4.7, category: "series" as const },
  { title: "Design Systems", rating: 4.5, category: "courses" as const },
];

const suggestedUsers = [
  { name: "Lena Park", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face", reviews: 128 },
  { name: "James Wright", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", reviews: 95 },
  { name: "Maya Singh", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face", reviews: 210 },
];

export default function Feed() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search reviews, items, or people..." className="pl-9 rounded-xl bg-card border-border" />
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <div className="hidden md:flex items-center gap-2">
            {(["books", "movies", "series", "courses"] as const).map((cat) => (
              <button key={cat}>
                <CategoryBadge category={cat} size="md" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" className="text-primary font-medium">Latest</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Popular</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Following</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feedReviews.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">Trending</h3>
              </div>
              <div className="space-y-3">
                {trendingItems.map((item, i) => (
                  <Link key={i} to="/item/1" className="flex items-center justify-between hover:bg-accent rounded-lg p-2 -mx-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <CategoryBadge category={item.category} />
                      </div>
                    </div>
                    <StarRating rating={Math.round(item.rating)} size="sm" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Suggested Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">Suggested</h3>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.reviews} reviews</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-7">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Popular Lists */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">Popular Lists</h3>
              </div>
              <div className="space-y-2">
                {["Best Sci-Fi of 2026", "Must-Read Non-Fiction", "Underrated Series Gems", "Free Online Courses"].map((list) => (
                  <a key={list} href="#" className="block text-sm py-2 px-3 -mx-1 rounded-lg hover:bg-accent transition-colors">
                    {list}
                  </a>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
