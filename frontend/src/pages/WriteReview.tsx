import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Search, Send } from "lucide-react";

export default function WriteReview() {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Write a Review</h1>
          <p className="text-muted-foreground mb-8">Share your thoughts with the community</p>

          <div className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
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

            {/* Search Item */}
            <div className="space-y-2">
              <Label>Search Item</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search for a book, movie, series, or course..." className="pl-9 rounded-xl bg-card" />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-3">
                <StarRating rating={rating} size="lg" interactive onRate={setRating} />
                {rating > 0 && (
                  <span className="text-sm text-muted-foreground">{rating}/5</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Review Title</Label>
              <Input placeholder="Give your review a catchy title..." className="rounded-xl bg-card" />
            </div>

            {/* Review */}
            <div className="space-y-2">
              <Label>Your Review</Label>
              <Textarea
                placeholder="What did you think? Share your honest opinion..."
                className="min-h-[200px] rounded-xl bg-card resize-none"
              />
            </div>

            {/* Spoiler Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-medium">Contains Spoilers</p>
                <p className="text-xs text-muted-foreground">Mark if your review reveals plot details</p>
              </div>
              <Switch />
            </div>

            {/* Submit */}
            <Button className="w-full rounded-xl gradient-primary text-primary-foreground border-0 shadow-glow h-12 text-base gap-2">
              <Send className="w-4 h-4" /> Publish Review
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
