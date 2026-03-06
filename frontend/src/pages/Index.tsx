import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { CategoryBadge } from "@/components/CategoryBadge";
import {
  ArrowRight,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  TrendingUp,
  Quote,
} from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    key: "books" as const,
    label: "Books",
    icon: BookOpen,
    count: "12.4K",
    desc: "Literary reviews & ratings",
  },
  {
    key: "movies" as const,
    label: "Movies",
    icon: Film,
    count: "28.1K",
    desc: "Cinema reviews & watchlists",
  },
  {
    key: "series" as const,
    label: "Series",
    icon: Tv,
    count: "9.8K",
    desc: "TV shows & binge lists",
  },
  {
    key: "courses" as const,
    label: "Courses",
    icon: GraduationCap,
    count: "5.2K",
    desc: "Learning reviews & paths",
  },
];

const trending = [
  {
    title: "Dune: Part Three",
    category: "movies" as const,
    rating: 4.5,
    cover:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=300&h=400&fit=crop",
  },
  {
    title: "The Midnight Library",
    category: "books" as const,
    rating: 4.3,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
  },
  {
    title: "Severance S3",
    category: "series" as const,
    rating: 4.7,
    cover:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=400&fit=crop",
  },
  {
    title: "AI Fundamentals",
    category: "courses" as const,
    rating: 4.6,
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop",
  },
  {
    title: "Interstellar 2",
    category: "movies" as const,
    rating: 4.8,
    cover:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=400&fit=crop",
  },
];

const topReviewers = [
  {
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    reviews: 342,
    specialty: "Books",
  },
  {
    name: "Marcus Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    reviews: 287,
    specialty: "Movies",
  },
  {
    name: "Aisha Patel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    reviews: 256,
    specialty: "Series",
  },
];

const testimonials = [
  {
    text: "ReviewSphere changed how I discover content. The community recommendations are incredibly accurate.",
    author: "Emily R.",
    role: "Book Enthusiast",
  },
  {
    text: "Finally a platform that brings together all my reviews in one beautiful place. Love the interface!",
    author: "David K.",
    role: "Film Critic",
  },
  {
    text: "The course review section helped me save hundreds of dollars by choosing the right learning paths.",
    author: "Priya M.",
    role: "Lifelong Learner",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/check`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.authenticated) {
          navigate("/feed");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8">
              <TrendingUp className="w-3.5 h-3.5" />
              50K+ reviews this month
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Discover. Review. <span className="text-gradient">Recommend.</span>
            <br />
            All in One Place.
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Your unified platform for honest reviews across books, movies,
            series, and courses. Join a community of passionate reviewers.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 transition-opacity"
            >
              <Link to="/feed">
                Explore Reviews
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8"
            >
              <Link to="/feed">Join Community</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Dive into reviews across four major content categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to="/feed"
                  className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-category-${cat.key}/10`}
                    >
                      <cat.icon
                        className={`w-5 h-5 text-category-${cat.key}`}
                      />
                    </div>
                    <CategoryBadge category={cat.key} size="md" />
                  </div>
                  <p className="text-2xl font-display font-bold mb-1">
                    {cat.count}
                  </p>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            {...fadeUp}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                Trending This Week
              </h2>
              <p className="text-muted-foreground">
                What the community is talking about
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trending.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link to="/item/1" className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 right-2">
                      <CategoryBadge category={item.category} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <StarRating rating={item.rating} size="sm" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Reviewers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Top Reviewers
            </h2>
            <p className="text-muted-foreground">
              The voices shaping our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {topReviewers.map((reviewer, i) => (
              <motion.div
                key={reviewer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <img
                  src={reviewer.avatar}
                  alt={reviewer.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-2 ring-primary/20"
                />
                <h3 className="font-semibold mb-1">{reviewer.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {reviewer.specialty} Expert
                </p>
                <p className="text-sm font-medium text-primary">
                  {reviewer.reviews} reviews
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              What People Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-sm leading-relaxed mb-4">{t.text}</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center p-12 sm:p-16 rounded-3xl gradient-primary relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Join the Community?
              </h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
                Start discovering, reviewing, and connecting with thousands of
                passionate content lovers.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl px-8 bg-background text-foreground hover:bg-background/90"
              >
                <Link to="/feed">Get Started Free</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
