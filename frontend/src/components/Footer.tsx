import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center shrink-0"
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "white",
              }}
            >
              <span className="text-gradient">Review•</span>It
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover, review, and recommend content across books, movies,
              series, and courses.
            </p>
          </div>
          {[
            {
              title: "Platform",
              links: ["Explore", "Trending", "Lists", "Community"],
            },
            {
              title: "Support",
              links: ["Help Center", "Guidelines", "Contact", "FAQ"],
            },
            { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-sm mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Review•It. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
