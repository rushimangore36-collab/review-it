import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Moon, Sun, Menu, X, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Default avatar as inline SVG data URI — no external dependency
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%236366f1'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%23fff' opacity='.9'/%3E%3Cellipse cx='20' cy='34' rx='12' ry='9' fill='%23fff' opacity='.9'/%3E%3C/svg%3E";

async function checkAuth(backendUrl) {
  const res = await fetch(`${backendUrl}/auth/check`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
}

async function searchUsersApi(backendUrl, query) {
  const res = await fetch(
    `${backendUrl}/users?action=search&q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.users || data || [];
}

export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const isLanding = location.pathname === "/";

  const navLinks = [
    { label: "Feed", to: "/feed" },
    { label: "Explore", to: "/explore" },
    { label: "Write", to: "/write" },
  ];

  // Sync dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Init: dark mode + auth check
  useEffect(() => {
    document.documentElement.classList.add("dark");
    checkAuth(backendUrl)
      .then((data) => {
        setIsLoggedIn(data.authenticated);
        setUserId(data.id ?? null);
        setUserAvatar(data.avatar ?? null);
      })
      .catch(console.error);
  }, [backendUrl]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    navigate("/");
  };

  const doSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }
      setSearchLoading(true);
      try {
        const results = await searchUsersApi(backendUrl, query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [backendUrl]
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleUserSelect = (user) => {
    navigate(`/profile/${user.id}`);
    closeSearch();
  };

  const showDropdown = searchOpen && searchQuery.length > 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-primary-foreground">
                R
              </span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              ReviewIt
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    key="open"
                    initial={{ width: 36, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 36, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center gap-2 bg-accent/60 border border-border/60 rounded-xl px-3 h-9 overflow-hidden backdrop-blur-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search users..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 min-w-0"
                    />
                    {searchLoading ? (
                      <Loader2 className="w-3.5 h-3.5 text-muted-foreground shrink-0 animate-spin" />
                    ) : searchQuery ? (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          inputRef.current?.focus();
                        }}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-9 w-9"
                      onClick={handleSearchOpen}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="absolute top-full right-0 mt-2 w-72 glass border border-border/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl"
                  >
                    {searchLoading ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching…
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-1.5">
                        <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                          Users
                        </p>
                        {searchResults.slice(0, 6).map((user, i) => (
                          <motion.button
                            key={user.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleUserSelect(user)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent/60 transition-colors text-left group"
                          >
                            <UserAvatar src={user.avatar} size={8} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                {user.name || user.username}
                              </p>
                              {user.username && (
                                <p className="text-xs text-muted-foreground truncate">
                                  @{user.username}
                                </p>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-8">
                        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                          <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No users found
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          Try a different name
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-9 w-9"
              onClick={() => setIsDark((d) => !d)}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* Auth / profile section — hidden on landing */}
            {!isLanding && (
              <>
                {isLoggedIn ? (
                  <>
                    <Link
                      to={`/profile/${userId}`}
                      className="shrink-0"
                      aria-label="My profile"
                    >
                      <UserAvatar src={userAvatar} size={8} ring />
                    </Link>

                    <button
                      onClick={logout}
                      className="hidden md:flex items-center px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-400/40 rounded-xl hover:bg-red-500/10 hover:border-red-400 hover:text-red-300 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/auth/login">
                      <Button
                        variant="ghost"
                        className="rounded-xl text-sm h-9 px-4"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth/register">
                      <Button className="rounded-xl text-sm h-9 px-4 shadow-md">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl h-9 w-9"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/60"
          >
            <div className="container mx-auto px-4 py-4 space-y-1.5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {!isLanding && (
                <div className="pt-2 border-t border-border/60 mt-2 space-y-1.5">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 border border-red-400/30 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Reusable avatar component ─────────────────────────────────────────────────
function UserAvatar({ src, size = 8, ring = false }) {
  const [errored, setErrored] = useState(false);
  const cls = `w-${size} h-${size} rounded-full object-cover ${
    ring
      ? "ring-2 ring-border hover:ring-primary/50 transition-all duration-200"
      : "ring-2 ring-border group-hover:ring-primary/40 transition-all"
  }`;

  if (src && !errored) {
    return (
      <img
        src={src}
        alt="Avatar"
        className={cls}
        onError={() => setErrored(true)}
      />
    );
  }

  // Default avatar — indigo gradient with silhouette
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center shrink-0 ${
        ring
          ? "ring-2 ring-border hover:ring-primary/50 transition-all duration-200"
          : "ring-2 ring-border group-hover:ring-primary/40 transition-all"
      }`}
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      }}
    >
      <User className={`text-white/90 ${size <= 8 ? "w-4 h-4" : "w-5 h-5"}`} />
    </div>
  );
}
