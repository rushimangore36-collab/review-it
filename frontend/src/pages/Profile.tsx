import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";

const profileReviews = [
  {
    coverImage:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=600&h=340&fit=crop",
    title: "Dune: Part Three — A Visual Masterpiece",
    category: "movies" as const,
    rating: 5,
    reviewText:
      "Villeneuve has outdone himself yet again. The third installment brings the saga to a breathtaking conclusion.",
    author: {
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    likes: 234,
    comments: 45,
  },
  {
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=340&fit=crop",
    title: "The Midnight Library — A Comfort Read",
    category: "books" as const,
    rating: 4,
    reviewText:
      "A thoughtful exploration of parallel lives. Heartwarming and deeply personal.",
    author: {
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    likes: 189,
    comments: 32,
  },
];

const stats = [
  { label: "Reviews", value: "342" },
  { label: "Followers", value: "1.2K" },
  { label: "Following", value: "489" },
  { label: "Avg Rating", value: "4.3" },
];

export default function Profile() {
  const [name, setName] = useState("Sarah Chen");
  const [username, setUsername] = useState("@sarahchen");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setName(data.name);
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&h=400&fit=crop"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face"
              alt="Sarah Chen"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow-lg"
            />
            <div className="flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                {name}
              </h1>
              <p className="text-muted-foreground text-sm">@{username}</p>
            </div>
            <Button variant="outline" className="rounded-xl">
              Edit Profile
            </Button>
          </div>

          <p className="text-sm text-muted-foreground max-w-xl mb-4">
            Avid reader, film lover, and course collector. I review everything I
            consume and love connecting with fellow enthusiasts. Always looking
            for the next great story.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> San Francisco
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Joined Mar 2024
            </span>
            <a
              href="#"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" /> reviewsphere.com/sarah
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-md">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-xl bg-card border border-border"
              >
                <p className="font-display font-bold text-xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="reviews">
          <TabsList className="bg-card border border-border rounded-xl mb-6 p-1">
            <TabsTrigger value="reviews" className="rounded-lg">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg">
              Saved
            </TabsTrigger>
            <TabsTrigger value="lists" className="rounded-lg">
              Lists
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="rounded-lg">
              Watchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileReviews.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">No saved items yet</p>
              <p className="text-sm text-muted-foreground">
                Items you save will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="lists">
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">No custom lists yet</p>
              <Button variant="outline" className="rounded-xl mt-2">
                Create a List
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="watchlist">
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">
                Your watchlist is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Start adding items to watch later
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
