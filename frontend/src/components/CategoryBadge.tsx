import { Badge } from "@/components/ui/badge";

type Category = "books" | "movies" | "series" | "courses";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  books: { label: "Books", className: "bg-category-books/15 text-category-books border-category-books/30" },
  movies: { label: "Movies", className: "bg-category-movies/15 text-category-movies border-category-movies/30" },
  series: { label: "Series", className: "bg-category-series/15 text-category-series border-category-series/30" },
  courses: { label: "Courses", className: "bg-category-courses/15 text-category-courses border-category-courses/30" },
};

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"} font-medium rounded-full`}
    >
      {config.label}
    </Badge>
  );
}
