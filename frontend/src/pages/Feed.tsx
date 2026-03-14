import { Navbar } from "@/components/Navbar";
import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

type Category = "books" | "movies" | "series" | "courses";
type SortKey = "recent" | "top";

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

const CATEGORIES: {
  key: Category;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  activeBg: string;
}[] = [
  {
    key: "books",
    label: "Books",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "border-border bg-card text-muted-foreground hover:border-amber-300 hover:text-amber-600 dark:hover:text-amber-400",
    activeBg:
      "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300",
  },
  {
    key: "movies",
    label: "Movies",
    icon: <Film className="w-3.5 h-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400",
    activeBg:
      "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300",
  },
  {
    key: "series",
    label: "Series",
    icon: <Tv className="w-3.5 h-3.5" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "border-border bg-card text-muted-foreground hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400",
    activeBg:
      "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300",
  },
  {
    key: "courses",
    label: "Courses",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: "text-green-600 dark:text-green-400",
    bg: "border-border bg-card text-muted-foreground hover:border-green-300 hover:text-green-600 dark:hover:text-green-400",
    activeBg:
      "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300",
  },
];

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");
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

  const filtered = useMemo(() => {
    let list = reviews.filter(
      (r) =>
        activeCategory === "all" || r.category?.toLowerCase() === activeCategory
    );
    if (sort === "top") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return list;
  }, [reviews, activeCategory, sort]);

  // Derived counts per category
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const r of reviews) {
      const cat = r.category?.toLowerCase() as Category;
      if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [reviews]);

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory((prev) => (prev === cat ? "all" : cat));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero header ── */}
      <div className="border-b border-border bg-card/40">
        <div className="container mx-auto px-4 pt-24 pb-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              Discover Reviews
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Books, movies, series and courses — reviewed by the community.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews, titles, authors…"
                className="pl-10 rounded-xl bg-background border-border h-11 text-sm focus-visible:ring-1"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* ── Category cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key] ?? 0;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-md ${
                  isActive ? cat.activeBg : cat.bg
                }`}
              >
                <div className="mb-2">{cat.icon}</div>
                <p className="font-semibold text-sm">{cat.label}</p>
                <p className="text-xs opacity-60 mt-0.5">
                  {isLoading ? "—" : `${count} review${count !== 1 ? "s" : ""}`}
                </p>
              </button>
            );
          })}
        </motion.div>

        {/* ── Toolbar: results count + sort ── */}
        <div className="flex items-center justify-between mb-5">
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.p
                key={`${filtered.length}-${activeCategory}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground"
              >
                {filtered.length === 0
                  ? "No results"
                  : `${filtered.length} ${
                      filtered.length === 1 ? "review" : "reviews"
                    }${
                      activeCategory !== "all" ? ` in ${activeCategory}` : ""
                    }${search ? ` for "${search}"` : ""}`}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Sort toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {(
              [
                {
                  key: "recent",
                  label: "Recent",
                  icon: <Clock className="w-3 h-3" />,
                },
                {
                  key: "top",
                  label: "Top rated",
                  icon: <TrendingUp className="w-3 h-3" />,
                },
              ] as { key: SortKey; label: string; icon: React.ReactNode }[]
            ).map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
                  sort === s.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-border bg-card/50 space-y-4"
                >
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card/40 text-muted-foreground"
              >
                <Sparkles className="w-8 h-8 opacity-10 mb-3" />
                <p className="font-medium text-foreground text-sm mb-1">
                  No reviews found
                </p>
                <p className="text-xs">
                  {search
                    ? `Nothing matched "${search}". Try a different term.`
                    : activeCategory !== "all"
                    ? `No ${activeCategory} reviews yet.`
                    : "Check back later for new reviews."}
                </p>
              </motion.div>
            ) : (
              filtered.map((review, i) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <Link
                    to={`/reviews/${review.id}`}
                    className="block group h-full"
                  >
                    <div className="rounded-2xl overflow-hidden border border-border bg-card h-full transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 hover:border-primary/20">
                      <ReviewCard {...review} />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
