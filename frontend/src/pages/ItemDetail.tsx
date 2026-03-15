import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PenLine, User, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

type Category = "books" | "movies" | "series" | "courses";

interface ReviewItem {
  id: number;
  category: Category;
  name: string;
  title: string;
  rating: number;
  description: string;
  author: { id: number; name: string; username: string } | null;
  likes?: number;
  comments?: number;
}

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<ReviewItem | null>(null);
  const [authorReviews, setAuthorReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const getItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/reviews/${id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        setItem(data);

        // Fetch more reviews by the same author
        if (data?.author?.id) {
          const r2 = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/reviews?action=getUserReviews&id=${data.author.id}`,
            { method: "GET" }
          );
          const authorData = await r2.json();
          // Exclude current review
          setAuthorReviews(
            Array.isArray(authorData)
              ? authorData
                  .filter((r: ReviewItem) => String(r.id) !== id)
                  .slice(0, 3)
              : []
          );
        }
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };
    getItem();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[35vh] sm:h-[45vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=600&fit=crop"
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-28 relative z-10 pb-16 max-w-5xl">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main content ── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              ) : item ? (
                <>
                  {/* Category + author meta */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <CategoryBadge category={item.category} size="md" />
                    {item.author && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <User className="w-3.5 h-3.5" />
                        {item.author.name}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 leading-tight">
                    {item.name}
                  </h1>

                  {/* Review title */}
                  {item.title && item.title !== item.name && (
                    <p className="text-muted-foreground text-base mb-4 italic">
                      "{item.title}"
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <StarRating rating={item.rating} size="md" />
                    <span className="font-semibold text-lg">{item.rating}</span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-base mb-8">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-3 mb-12">
                    <Button asChild className="rounded-xl gap-2">
                      <Link to="/write">
                        <PenLine className="w-4 h-4" />
                        Write a Review
                      </Link>
                    </Button>
                  </div>

                  {/* More by this author */}
                  {authorReviews.length > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-base">
                          More by{" "}
                          <Link
                            to={`/profile/${item.author?.id}`}
                            className="text-primary hover:underline"
                          >
                            {item.author?.name}
                          </Link>
                        </h2>
                        <Link
                          to={`/profile/${item.author?.id}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          View all →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {authorReviews.map((review, i) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.1 + i * 0.07,
                              duration: 0.3,
                            }}
                          >
                            <Link
                              to={`/reviews/${review.id}`}
                              className="block group"
                            >
                              <div className="rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 hover:border-primary/20">
                                <ReviewCard
                                  title={review.title}
                                  name={review.name}
                                  category={review.category}
                                  rating={review.rating}
                                  description={review.description}
                                  author={review.author ?? { name: "" }}
                                  likes={review.likes}
                                  comments={review.comments}
                                />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border text-muted-foreground">
                  <p className="font-medium text-foreground text-sm mb-1">
                    Review not found
                  </p>
                  <p className="text-xs">This review may have been removed.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5">
            {/* Author card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                Reviewer
              </h3>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : item?.author ? (
                <Link
                  to={`/profile/${item.author.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                    {item.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                      {item.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{item.author.username}
                    </p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown author</p>
              )}
            </motion.div>

            {/* Review meta */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.35 }}
              className="p-5 rounded-2xl bg-card border border-border space-y-4"
            >
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Details
              </h3>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : item ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd>
                      <CategoryBadge category={item.category} size="sm" />
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd className="flex items-center gap-1.5 font-medium">
                      <StarRating rating={item.rating} size="sm" />
                      {item.rating}/5
                    </dd>
                  </div>
                  {item.author && (
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Reviewed by</dt>
                      <dd className="font-medium">{item.author.name}</dd>
                    </div>
                  )}
                </dl>
              ) : null}
            </motion.div>

            {/* Write review CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="p-5 rounded-2xl border border-dashed border-border bg-card/50 text-center"
            >
              <PenLine className="w-6 h-6 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm font-medium mb-1">Have an opinion?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Share your own take on {item?.name ?? "this"}.
              </p>
              <Button asChild size="sm" className="rounded-xl w-full gap-1.5">
                <Link to="/write">
                  <PenLine className="w-3.5 h-3.5" />
                  Write a Review
                </Link>
              </Button>
            </motion.div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
