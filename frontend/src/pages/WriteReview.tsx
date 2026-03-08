import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Search, Send } from "lucide-react";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

export default function WriteReview() {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    rating: 0,
    title: "",
    description: "",
    authorId: 0,
  });

  const handleSubmit = async () => {
    const reviewData = {
      category: formData.category,
      name: formData.name,
      rating: formData.rating,
      title: formData.title,
      description: formData.description,
    };

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });

    if (res.ok) {
      alert("Review submitted successfully!");
    } else {
      alert("Failed to submit review. Please try again.");
    }
  };

  const onChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Write a Review
          </h1>
          <p className="text-muted-foreground mb-8">
            Share your thoughts with the community
          </p>

          <div className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onChange("category", value)}
              >
                <SelectTrigger className="rounded-xl bg-card">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">📚 Books</SelectItem>
                  <SelectItem value="movies">🎬 Movies</SelectItem>
                  <SelectItem value="series">📺 Series</SelectItem>
                  <SelectItem value="courses">🎓 Courses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* name */}
            <div className="space-y-2">
              <Label>name</Label>
              <div className="relative">
                <Input
                  placeholder="Search for a book, movie, series, or course..."
                  className="pl-9 rounded-xl bg-card"
                  value={formData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={formData.rating}
                  size="lg"
                  interactive
                  onRate={(rating) => setFormData({ ...formData, rating })}
                />
                {formData.rating > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {formData.rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Review Title</Label>
              <Input
                placeholder="Give your review a catchy title..."
                className="rounded-xl bg-card"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </div>

            {/* Review */}
            <div className="space-y-2">
              <Label>Your Review</Label>
              <Textarea
                placeholder="What did you think? Share your honest opinion..."
                className="min-h-[200px] rounded-xl bg-card resize-none"
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </div>

            {/* Spoiler Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-medium">Contains Spoilers</p>
                <p className="text-xs text-muted-foreground">
                  Mark if your review reveals plot details
                </p>
              </div>
              <Switch />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full rounded-xl gradient-primary text-primary-foreground border-0 shadow-glow h-12 text-base gap-2"
            >
              <Send className="w-4 h-4" /> Publish Review
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
