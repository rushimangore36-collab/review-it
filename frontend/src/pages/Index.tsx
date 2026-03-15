import { motion, useScroll, useTransform } from "framer-motion";
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
  Sparkles,
  ChevronRight,
} from "lucide-react";
import React, { useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: "books" as const,
    label: "Books",
    Icon: BookOpen,
    count: "12.4K",
    desc: "Literary reviews & ratings",
  },
  {
    key: "movies" as const,
    label: "Movies",
    Icon: Film,
    count: "28.1K",
    desc: "Cinema reviews & watchlists",
  },
  {
    key: "series" as const,
    label: "Series",
    Icon: Tv,
    count: "9.8K",
    desc: "TV shows & binge lists",
  },
  {
    key: "courses" as const,
    label: "Courses",
    Icon: GraduationCap,
    count: "5.2K",
    desc: "Learning reviews & paths",
  },
];

const TRENDING = [
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

const TOP_REVIEWERS = [
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

const TESTIMONIALS = [
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
    text: "The course review section helped me save hundreds on learning paths.",
    author: "Priya M.",
    role: "Lifelong Learner",
  },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: EASE },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.93 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.45, delay, ease: EASE },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  sub,
}: {
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <motion.div {...fadeUp()} className="text-center mb-12">
      <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
        {title}
      </h2>
      {sub && <p className="text-muted-foreground max-w-lg mx-auto">{sub}</p>}
    </motion.div>
  );
}

function TrendingCard({
  item,
  index,
}: {
  item: (typeof TRENDING)[number];
  index: number;
}) {
  return (
    <motion.div {...scaleIn(index * 0.07)}>
      <Link to="/item/1" className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md">
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Persistent bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-2.5 right-2.5">
            <CategoryBadge category={item.category} />
          </div>
          {/* Hover CTA strip */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90">
              Read reviews <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">
          {item.title}
        </h3>
        <StarRating rating={item.rating} size="sm" />
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 px-4 overflow-hidden"
      >
        {/* Parallax ambient blobs */}
        <motion.div
          style={{ y: heroY }}
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[100px]" />
        </motion.div>

        <div className="container mx-auto text-center max-w-4xl">
          {/* Pill badge */}
          <motion.div {...fadeUp()}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8">
              <TrendingUp className="w-3.5 h-3.5" />
              50K+ reviews this month
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            Discover. Review. <span className="text-gradient">Recommend.</span>
            <br />
            All in One Place.
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Your unified home for honest reviews across books, movies, series,
            and courses — powered by a community of passionate voices.
          </motion.p>

          {/* Primary CTA — bigger, more magnetic */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="group relative rounded-xl px-9 py-6 text-base gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 transition-opacity overflow-hidden"
            >
              <Link to="/feed">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Explore Reviews
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 py-6 text-base"
            >
              <Link to="/auth/register">Join Free</Link>
            </Button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            {...fadeUp(0.45)}
            className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              ["55K+", "Members"],
              ["4 ", "Categories"],
              ["4.8★", "Avg rating"],
            ].map(([n, l]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">{n}</span>
                {l}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader
            title="Explore by Category"
            sub="Dive into reviews across four major content categories"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.key} {...fadeUp(i * 0.09)}>
                <Link
                  to="/feed"
                  className="group flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center bg-category-${cat.key}/10 group-hover:scale-110 transition-transform`}
                    >
                      <cat.Icon
                        className={`w-5 h-5 text-category-${cat.key}`}
                      />
                    </div>
                    <CategoryBadge category={cat.key} size="md" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">
                    {cat.count}
                  </p>
                  <p className="text-sm text-muted-foreground flex-1">
                    {cat.desc}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    Browse <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader title="What People Say" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                {...fadeUp(i * 0.1)}
                className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <Quote className="w-8 h-8 text-primary/15 mb-4" />
                <p className="text-sm leading-relaxed mb-5 text-muted-foreground">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-none">
                      {t.author}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            {...fadeUp()}
            className="relative text-center p-14 sm:p-20 rounded-3xl gradient-primary overflow-hidden"
          >
            {/* Decorative circles */}
            <div
              className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-2xl"
              aria-hidden
            />

            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                Ready to Join?
              </h2>
              <p className="text-primary-foreground/75 max-w-md mx-auto mb-8 text-lg">
                Start discovering, reviewing, and connecting with thousands of
                passionate content lovers.
              </p>
              <Button
                asChild
                size="lg"
                className="group rounded-xl px-10 py-6 text-base bg-background text-foreground hover:bg-background/90 shadow-xl"
              >
                <Link to="/feed">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
