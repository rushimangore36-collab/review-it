import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type Category = "books" | "movies" | "series" | "courses";

interface Review {
  id: number;
  category: Category;
  name: string;
  rating: number;
  title: string;
  description: string;
  author: { name: string };
}

interface Meta {
  total: number;
  page: number;
  totalPages: number;
}

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setLoading] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const rating = searchParams.get("rating") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = searchParams.get("page") || "1";

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (rating) params.set("rating", rating);
      params.set("sortBy", sortBy);
      params.set("order", order);
      params.set("page", page);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reviews?${params}`
      );
      const data = await res.json();
      setResults(data.results);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, [q, category, rating, sortBy, order, page]);

  // Debounce: only refetch 400ms after params settle
  useEffect(() => {
    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1"); // reset page on filter change
    setSearchParams(next);
  };

  return {
    results,
    meta,
    isLoading,
    q,
    category,
    rating,
    sortBy,
    order,
    page: Number(page),
    setQ: (v: string) => setParam("q", v),
    setCategory: (v: string) => setParam("category", v),
    setRating: (v: string) => setParam("rating", v),
    setSortBy: (v: string) => setParam("sortBy", v),
    setOrder: (v: string) => setParam("order", v),
    setPage: (v: number) => setParam("page", String(v)),
  };
};
