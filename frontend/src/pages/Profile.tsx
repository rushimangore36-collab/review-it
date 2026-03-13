import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { CategoryBadge } from "@/components/CategoryBadge";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  UserPlus,
  UserCheck,
  Share2,
  MoreHorizontal,
  Star,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  Bookmark,
  List,
  Clock,
  Pencil,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

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

export default function Profile() {
  const { id } = useParams<{ id: string }>();

  // ── profile data ──────────────────────────────────────────────
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileReviews, setProfileReviews] = useState<Review[]>([]);

  // ── social state ──────────────────────────────────────────────
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // ── ownership ─────────────────────────────────────────────────
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // ── loading state ─────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  // Derived: are we viewing our own profile?
  const isOwnProfile = currentUserId !== null && String(currentUserId) === id;

  // ── fetch current logged-in user ─────────────────────────────
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users?action=me`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) return;
        const data = await res.json();
        // Adjust to match your API shape — data.id or just data (if it returns a plain number)
        setCurrentUserId(data.id ?? data ?? null);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // ── fetch follow info ─────────────────────────────────────────
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

  // ── fetch profile + reviews ───────────────────────────────────
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

  // ── follow / unfollow ─────────────────────────────────────────
  const handleFollow = async () => {
    if (followLoading) return;
    const action = isFollowing ? "unfollow" : "follow";
    setFollowLoading(true);

    // Optimistic update
    setIsFollowing((prev) => !prev);
    setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/follows?action=${action}&id=${id}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Request failed");
    } catch (error) {
      // Revert optimistic update on failure
      setIsFollowing((prev) => !prev);
      setFollowerCount((prev) => (isFollowing ? prev + 1 : prev - 1));
      console.error("Follow/unfollow failed:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const stats = [
    { label: "Reviews", value: profileReviews.length },
    { label: "Followers", value: followerCount },
    { label: "Following", value: followingCount },
    { label: "Avg Rating", value: "4.3" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Banner ── */}
      <div className="relative h-52 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&h=400&fit=crop"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Avatar + Actions row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-5">
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
                className="w-28 h-28 rounded-2xl object-cover border-4 border-background shadow-xl ring-2 ring-border"
              />
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow" />
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight truncate">
                      {name || "Unknown User"}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-current" /> Top Reviewer
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    @{username || "—"}
                  </p>
                </>
              )}
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex items-center gap-2 sm:self-end">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-border h-9 w-9"
                aria-label="Share profile"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-border h-9 w-9"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>

              {/* Edit Profile (own) vs Follow (others) — animated swap */}
              <AnimatePresence mode="wait">
                {isOwnProfile ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border border-border h-9 px-4 text-sm gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit Profile
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="follow"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    whileTap={{ scale: 0.96 }}
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
              </AnimatePresence>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground max-w-xl mb-4 leading-relaxed">
            Avid reader, film lover, and course collector. I review everything I
            consume and love connecting with fellow enthusiasts. Always looking
            for the next great story.
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              San Francisco
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/60" />
              Joined Mar 2024
            </span>
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-primary transition-colors duration-150"
            >
              <LinkIcon className="w-3.5 h-3.5 text-primary/60" />
              reviewsphere.com/sarah
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 max-w-sm">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                className="text-center p-3 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-default group"
              >
                <p className="font-display font-bold text-xl leading-none mb-1 group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Tabs defaultValue="reviews">
            <TabsList className="bg-card border border-border rounded-xl mb-6 p-1 gap-0.5">
              <TabsTrigger
                value="reviews"
                className="rounded-lg gap-1.5 text-sm"
              >
                <Star className="w-3.5 h-3.5" />
                Reviews
                {profileReviews.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                    {profileReviews.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-lg gap-1.5 text-sm">
                <Bookmark className="w-3.5 h-3.5" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="lists" className="rounded-lg gap-1.5 text-sm">
                <List className="w-3.5 h-3.5" />
                Lists
              </TabsTrigger>
              <TabsTrigger
                value="watchlist"
                className="rounded-lg gap-1.5 text-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                Watchlist
              </TabsTrigger>
            </TabsList>

            {/* Reviews tab */}
            <TabsContent value="reviews">
              {profileLoading ? (
                /* Skeleton loader */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-card h-52 animate-pulse"
                    />
                  ))}
                </div>
              ) : profileReviews.length === 0 ? (
                <EmptyState
                  icon={<Star className="w-10 h-10" />}
                  title="No reviews yet"
                  description="Reviews will appear here once posted."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileReviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={`/reviews/${review.id}`}
                        className="block group"
                      >
                        <div className="relative rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 hover:border-primary/20">
                          <div className="absolute top-3 right-3 z-10">
                            <CategoryBadge
                              category={
                                review.category?.toLowerCase() as Category
                              }
                              size="sm"
                            />
                          </div>
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
            </TabsContent>

            <TabsContent value="saved">
              <EmptyState
                icon={<Bookmark className="w-10 h-10" />}
                title="No saved items yet"
                description="Items you save will appear here"
              />
            </TabsContent>

            <TabsContent value="lists">
              <EmptyState
                icon={<List className="w-10 h-10" />}
                title="No custom lists yet"
                description="Curate your favourites into shareable lists"
                action={
                  <Button variant="outline" className="rounded-xl mt-3 gap-1.5">
                    <List className="w-3.5 h-3.5" /> Create a List
                  </Button>
                }
              />
            </TabsContent>

            <TabsContent value="watchlist">
              <EmptyState
                icon={<Clock className="w-10 h-10" />}
                title="Your watchlist is empty"
                description="Start adding items to watch later"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <div className="opacity-15 mb-4">{icon}</div>
      <p className="font-medium text-foreground mb-1">{title}</p>
      <p className="text-sm">{description}</p>
      {action}
    </div>
  );
}
