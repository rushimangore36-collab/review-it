import { Navbar } from "@/components/Navbar";
import { ReviewCard } from "@/components/ReviewCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";

type Category = "books" | "movies" | "series" | "courses";

interface Review {
  id: number;
  category: Category;
  name: string;
  rating: number;
  title: string;
  description: string;
  author: { name: string };
  likes?: number;
  comments?: number;
}

const CATEGORIES: Category[] = ["books", "movies", "series", "courses"];

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReviews = useCallback(async (searchTerm?: string) => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const url = searchTerm
        ? `${baseUrl}/reviews?action=search&search=${encodeURIComponent(
            searchTerm
          )}`
        : `${baseUrl}/reviews`;

      const res = await fetch(url);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!search) {
      fetchReviews();
    } else {
      debounceRef.current = setTimeout(() => fetchReviews(search), 400);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, fetchReviews]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        {/* Search & Filters */}
        <section className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="pl-9 rounded-xl bg-card border-border h-11"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-xl h-11 gap-2 border-border bg-card"
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <LayoutGrid className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="shrink-0 transition-transform active:scale-95"
              >
                <CategoryBadge category={cat} size="md" />
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-border bg-card/50 space-y-4"
                  >
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                ))
              : reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Link
                      to={`/reviews/${review.id}`}
                      className="block relative group"
                    >
                      <div className="absolute top-4 right-4 z-20">
                        {/* Optimization: Force lowercase and check for existence */}
                        {review.category && (
                          <CategoryBadge
                            category={review.category.toLowerCase() as Category}
                            size="sm"
                          />
                        )}
                      </div>
                      <ReviewCard {...review} />
                    </Link>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
