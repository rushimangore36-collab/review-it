import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">R</span>
              </div>
              <span className="font-display font-bold text-lg">ReviewSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover, review, and recommend content across books, movies, series, and courses.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Explore", "Trending", "Lists", "Community"] },
            { title: "Support", links: ["Help Center", "Guidelines", "Contact", "FAQ"] },
            { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 ReviewSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
