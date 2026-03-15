import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, type Variants } from "framer-motion";
import {
  Send,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewFormData {
  category: string;
  name: string;
  rating: number;
  title: string;
  description: string;
  hasSpoilers: boolean;
}

type SubmitState = "idle" | "loading" | "success" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "books", label: "Books", icon: BookOpen },
  { value: "movies", label: "Movies", icon: Film },
  { value: "series", label: "Series", icon: Tv },
  { value: "courses", label: "Courses", icon: GraduationCap },
] as const;

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const INITIAL_FORM: ReviewFormData = {
  category: "",
  name: "",
  rating: 0,
  title: "",
  description: "",
  hasSpoilers: false,
};

const MAX_DESCRIPTION = 2000;

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" as const },
  },
};

// ─── Shared label style ───────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
  color: "hsl(var(--muted-foreground))",
  display: "block",
  marginBottom: "10px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function WriteReview() {
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [charCount, setCharCount] = useState(0);

  const isFormValid =
    formData.category &&
    formData.name.trim() &&
    formData.rating > 0 &&
    formData.title.trim() &&
    formData.description.trim();

  const filledFields = [
    formData.category,
    formData.name.trim(),
    formData.rating > 0 ? "1" : "",
    formData.title.trim(),
    formData.description.trim(),
  ].filter(Boolean).length;

  const progressPct = (filledFields / 5) * 100;
  const selectedCategory = CATEGORIES.find(
    (c) => c.value === formData.category
  );

  const onChange = <K extends keyof ReviewFormData>(
    field: K,
    value: ReviewFormData[K]
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    if (val.length <= MAX_DESCRIPTION) {
      onChange("description", val);
      setCharCount(val.length);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || submitState === "loading") return;
    setSubmitState("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category: formData.category,
          name: formData.name,
          rating: formData.rating,
          title: formData.title,
          description: formData.description,
          hasSpoilers: formData.hasSpoilers,
        }),
      });

      if (res.ok) {
        setSubmitState("success");
        setFormData(INITIAL_FORM);
        setCharCount(0);
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    }

    setTimeout(() => setSubmitState("idle"), 3500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background glows */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-140px",
          right: "-140px",
          zIndex: 0,
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.10) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "-100px",
          left: "-100px",
          zIndex: 0,
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.07) 0%, transparent 65%)",
        }}
      />

      <Navbar />

      <div
        className="relative z-10 container mx-auto px-4"
        style={{ maxWidth: "680px", paddingTop: "96px", paddingBottom: "80px" }}
      >
        {/* ── Page header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: "40px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "3px",
                borderRadius: "2px",
                background: "hsl(var(--primary))",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "hsl(var(--primary))",
              }}
            >
              Community Review
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 5vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              marginBottom: "10px",
            }}
          >
            Share Your Take
          </h1>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.95rem",
            }}
          >
            Honest reviews help the community discover great content.
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "7px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Completeness
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "hsl(var(--primary))",
                }}
              >
                {filledFields} / 5 fields
              </span>
            </div>
            <div
              style={{
                height: "5px",
                borderRadius: "99px",
                background: "hsl(var(--border))",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                style={{
                  height: "100%",
                  borderRadius: "99px",
                  background: "hsl(var(--primary))",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Form ────────────────────────────────────────── */}
        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: "22px" }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* 1 · Category */}
          <motion.div variants={itemVariants}>
            <span style={labelStyle}>Category</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "10px",
              }}
            >
              {CATEGORIES.map(({ value, label, icon: Icon }) => {
                const active = formData.category === value;
                return (
                  <motion.button
                    key={value}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange("category", value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      padding: "16px 8px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      border: active
                        ? "2px solid hsl(var(--primary))"
                        : "2px solid hsl(var(--border))",
                      background: active
                        ? "hsl(var(--primary)/0.07)"
                        : "hsl(var(--card))",
                      color: active
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                      fontWeight: active ? 700 : 400,
                      fontSize: "13px",
                      transition: "all 0.16s ease",
                    }}
                  >
                    <Icon size={20} />
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* 2 · Item name */}
          <motion.div variants={itemVariants}>
            <Label htmlFor="item-name" style={labelStyle}>
              {selectedCategory ? `${selectedCategory.label} Title` : "Title"}
            </Label>
            <Input
              id="item-name"
              placeholder={
                formData.category
                  ? `Enter the ${formData.category} title…`
                  : "Book, movie, series or course name…"
              }
              className="bg-card"
              style={{
                borderRadius: "14px",
                height: "48px",
                fontSize: "15px",
                paddingLeft: "16px",
              }}
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </motion.div>

          {/* 3 · Star rating */}
          <motion.div variants={itemVariants}>
            <span style={labelStyle}>Your Rating</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 22px",
                borderRadius: "16px",
                background: "hsl(var(--card))",
                border: "1.5px solid hsl(var(--border))",
              }}
            >
              <StarRating
                rating={formData.rating}
                size="lg"
                interactive
                onRate={(r) => onChange("rating", r)}
              />
              <motion.div
                key={formData.rating}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ textAlign: "right", minWidth: "76px" }}
              >
                {formData.rating > 0 ? (
                  <>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        lineHeight: 1,
                        color: "hsl(var(--primary))",
                      }}
                    >
                      {formData.rating}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        {" "}
                        /5
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        marginTop: "3px",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {RATING_LABELS[formData.rating]}
                    </div>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Tap a star
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* 4 · Review title */}
          <motion.div variants={itemVariants}>
            <Label htmlFor="review-title" style={labelStyle}>
              Review Headline
            </Label>
            <Input
              id="review-title"
              placeholder="Give your review a catchy headline…"
              className="bg-card"
              style={{
                borderRadius: "14px",
                height: "48px",
                fontSize: "15px",
                paddingLeft: "16px",
              }}
              value={formData.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </motion.div>

          {/* 5 · Review body */}
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "10px",
              }}
            >
              <Label
                htmlFor="review-body"
                style={{ ...labelStyle, marginBottom: 0 }}
              >
                Your Review
              </Label>
              <span
                style={{
                  fontSize: "11px",
                  fontVariantNumeric: "tabular-nums",
                  color:
                    charCount > MAX_DESCRIPTION * 0.9
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--muted-foreground))",
                }}
              >
                {charCount} / {MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="review-body"
              placeholder="What did you think? Be honest, be specific — the community will thank you…"
              className="bg-card resize-none leading-relaxed"
              style={{
                borderRadius: "14px",
                minHeight: "180px",
                fontSize: "15px",
                padding: "14px 16px",
              }}
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          </motion.div>

          {/* 6 · Spoiler toggle */}
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderRadius: "16px",
                background: formData.hasSpoilers
                  ? "hsl(38 92% 50% / 0.07)"
                  : "hsl(var(--card))",
                border: formData.hasSpoilers
                  ? "1.5px solid hsl(38 92% 50% / 0.4)"
                  : "1.5px solid hsl(var(--border))",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "11px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: formData.hasSpoilers
                      ? "hsl(38 92% 50% / 0.15)"
                      : "hsl(var(--muted)/0.4)",
                    transition: "background 0.2s ease",
                  }}
                >
                  <AlertTriangle
                    size={17}
                    style={{
                      color: formData.hasSpoilers
                        ? "hsl(38 92% 50%)"
                        : "hsl(var(--muted-foreground))",
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    Contains Spoilers
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "hsl(var(--muted-foreground))",
                      marginTop: "2px",
                    }}
                  >
                    Warns readers before they see plot details
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.hasSpoilers}
                onCheckedChange={(v) => onChange("hasSpoilers", v)}
              />
            </div>
          </motion.div>

          {/* Feedback banners */}
          {submitState === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "hsl(var(--destructive)/0.08)",
                border: "1px solid hsl(var(--destructive)/0.25)",
                color: "hsl(var(--destructive))",
                fontSize: "13px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Something went wrong — please try again.
            </motion.div>
          )}

          {submitState === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "hsl(142 60% 40% / 0.08)",
                border: "1px solid hsl(142 60% 40% / 0.25)",
                color: "hsl(142 60% 40%)",
                fontSize: "13px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              ✓ Review published! Thank you for sharing.
            </motion.div>
          )}

          {/* Submit */}
          <motion.div variants={itemVariants}>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || submitState === "loading"}
              className="w-full gradient-primary text-primary-foreground border-0 shadow-glow"
              style={{
                borderRadius: "16px",
                height: "52px",
                fontSize: "16px",
                fontWeight: 700,
                gap: "8px",
                opacity: !isFormValid || submitState === "loading" ? 0.45 : 1,
                transition: "opacity 0.2s ease",
              }}
            >
              {submitState === "loading" ? (
                <>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "inline-block",
                      border: "2.5px solid currentColor",
                      borderTopColor: "transparent",
                      animation: "spin 0.65s linear infinite",
                    }}
                  />
                  Publishing…
                </>
              ) : (
                <>
                  <Send size={17} />
                  Publish Review
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
