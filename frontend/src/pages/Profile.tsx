import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  Star,
  Loader2,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";

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

const CATEGORY_META: Record<
  Category,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    bar: string;
  }
> = {
  books: {
    label: "Books",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40",
    bar: "bg-amber-400",
  },
  movies: {
    label: "Movies",
    icon: <Film className="w-3.5 h-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40",
    bar: "bg-blue-400",
  },
  series: {
    label: "Series",
    icon: <Tv className="w-3.5 h-3.5" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40",
    bar: "bg-purple-400",
  },
  courses: {
    label: "Courses",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40",
    bar: "bg-green-400",
  },
};

export default function Profile() {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileReviews, setProfileReviews] = useState<Review[]>([]);
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUserId !== null && String(currentUserId) === id;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users?action=me`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUserId(data.id ?? data ?? null);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchFollowInfo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/follows?action=getInfo&id=${id}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) return;
        const data = await res.json();
        setFollowerCount(Number(data.followers));
        setFollowingCount(Number(data.followings));
        setIsFollowing(Boolean(data.state));
      } catch (error) {
        console.error("Error fetching follow info:", error);
      }
    };
    fetchFollowInfo();
  }, [id]);

  const getProfile = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users?action=profile&id=${id}`,
        { method: "GET" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setName(data.name ?? "");
      setUsername(data.username ?? "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [id]);

  const getUserReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/reviews?action=getUserReviews&id=${id}`,
        { method: "GET" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setProfileReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    setProfileLoading(true);
    Promise.all([getProfile(), getUserReviews()]).finally(() =>
      setProfileLoading(false)
    );
  }, [getProfile, getUserReviews]);

  const handleFollow = async () => {
    if (followLoading) return;
    const action = isFollowing ? "unfollow" : "follow";
    setFollowLoading(true);
    setIsFollowing((prev) => !prev);
    setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/follows?action=${action}&id=${id}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Request failed");
    } catch (error) {
      setIsFollowing((prev) => !prev);
      setFollowerCount((prev) => (isFollowing ? prev + 1 : prev - 1));
      console.error("Follow/unfollow failed:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const r of profileReviews) {
      const cat = r.category?.toLowerCase() as Category;
      if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [profileReviews]);

  const avgRating = useMemo(() => {
    if (!profileReviews.length) return null;
    const sum = profileReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return (sum / profileReviews.length).toFixed(1);
  }, [profileReviews]);

  const filteredReviews = useMemo(
    () =>
      activeFilter === "all"
        ? profileReviews
        : profileReviews.filter(
            (r) => (r.category?.toLowerCase() as Category) === activeFilter
          ),
    [profileReviews, activeFilter]
  );

  const availableCategories = (
    Object.keys(categoryCounts) as Category[]
  ).filter((c) => (categoryCounts[c] ?? 0) > 0);

  const stats = [
    { label: "Reviews", value: profileReviews.length },
    { label: "Followers", value: followerCount },
    { label: "Following", value: followingCount },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-48 sm:h-60 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&h=400&fit=crop"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-14 relative z-10 pb-20 max-w-5xl">
        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative flex-shrink-0"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face"
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-background shadow-xl ring-1 ring-border"
              />
              <span className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            </motion.div>

            {/* Name / username */}
            <div className="flex-1 min-w-0">
              {profileLoading ? (
                <div className="space-y-2">
                  <div className="h-7 w-44 rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-28 rounded-lg bg-muted animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="font-semibold text-2xl sm:text-3xl tracking-tight truncate">
                    {name || "Unknown User"}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    @{username || "—"}
                  </p>
                </>
              )}
            </div>

            {/* Follow button — only on other profiles */}
            {!isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.96 }}
                className="sm:self-end"
              >
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  size="sm"
                  className={`rounded-xl h-9 px-4 text-sm font-medium transition-all duration-200 min-w-[100px] ${
                    isFollowing
                      ? "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-border"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Follow
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                className="rounded-2xl border border-border bg-card px-4 py-3"
              >
                <p className="font-bold text-xl leading-none mb-0.5">
                  {profileLoading ? (
                    <span className="inline-block w-10 h-5 rounded bg-muted animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}

            {/* Avg rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.33, duration: 0.3 }}
              className="rounded-2xl border border-border bg-card px-4 py-3"
            >
              <p className="font-bold text-xl leading-none mb-0.5 flex items-center gap-1.5">
                {profileLoading ? (
                  <span className="inline-block w-10 h-5 rounded bg-muted animate-pulse" />
                ) : avgRating ? (
                  <>
                    {avgRating}
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </>
                ) : (
                  <span className="text-muted-foreground text-base font-normal">
                    —
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Activity breakdown ── */}
        {!profileLoading && availableCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35 }}
            className="mb-8 rounded-2xl border border-border bg-card px-5 py-4"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Activity breakdown
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableCategories.map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = categoryCounts[cat] ?? 0;
                const pct = Math.round((count / profileReviews.length) * 100);
                return (
                  <div
                    key={cat}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${meta.bg} ${meta.color}`}
                  >
                    {meta.icon}
                    {meta.label}
                    <span className="opacity-50">·</span>
                    <span>{count}</span>
                    <span className="opacity-40 text-[10px]">({pct}%)</span>
                  </div>
                );
              })}
            </div>
            {/* Proportional bar */}
            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
              {availableCategories.map((cat) => {
                const pct =
                  ((categoryCounts[cat] ?? 0) / profileReviews.length) * 100;
                return (
                  <div
                    key={cat}
                    className={`${CATEGORY_META[cat].bar} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Reviews section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          {/* Header + filter pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Reviews
              {!profileLoading && profileReviews.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {profileReviews.length}
                </span>
              )}
            </h2>

            {!profileLoading && availableCategories.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 font-medium ${
                    activeFilter === "all"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {availableCategories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 font-medium flex items-center gap-1 ${
                        activeFilter === cat
                          ? `${meta.bg} ${meta.color} border-current`
                          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {meta.icon}
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grid */}
          {profileLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card h-52 animate-pulse"
                />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card/50 text-muted-foreground">
              <Star className="w-8 h-8 opacity-10 mb-3" />
              <p className="font-medium text-foreground text-sm mb-1">
                {activeFilter === "all"
                  ? "No reviews yet"
                  : `No ${CATEGORY_META[
                      activeFilter
                    ].label.toLowerCase()} reviews`}
              </p>
              <p className="text-xs">
                {activeFilter === "all"
                  ? "Reviews will appear here once posted."
                  : "Try selecting a different category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link to={`/reviews/${review.id}`} className="block group">
                    <div className="rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 hover:border-primary/20">
                      <ReviewCard
                        title={review.title}
                        name={review.name}
                        category={review.category}
                        rating={review.rating}
                        description={review.description}
                        author={review.author}
                        likes={review.likes}
                        comments={review.comments}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
