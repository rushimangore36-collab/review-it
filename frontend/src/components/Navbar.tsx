import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const isLanding = location.pathname === "/";

  const navLinks = [
    { label: "Feed", to: "/feed" },
    { label: "Explore", to: "/explore" },
    { label: "Write", to: "/write" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                R
              </span>
            </div>
            <span className="font-display font-bold text-lg">ReviewIt</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Search className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {!isLanding && (
              <>
                {/* Auth buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/auth/login">
                    <Button variant="ghost" className="rounded-xl text-sm">
                      Login
                    </Button>
                  </Link>

                  <Link to="/auth/register">
                    <Button className="rounded-xl text-sm">Register</Button>
                  </Link>
                </div>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hidden md:flex"
                >
                  <Bell className="w-4 h-4" />
                </Button>

                {/* Profile */}
                <Link to="/profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                  />
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Navigation links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth links */}
              {!isLanding && (
                <div className="pt-2 border-t border-border mt-2 space-y-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm hover:bg-accent"
                  >
                    Login
                  </Link>

                  <Link
                    to="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm hover:bg-accent"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
