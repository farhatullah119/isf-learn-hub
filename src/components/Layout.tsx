import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, MessageCircle, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Scholarships", path: "/scholarships" },
  { name: "Internships", path: "/internships" },
  { name: "Jobs", path: "/jobs" },
  { name: "Webinars & Seminars", path: "/webinars" },
  { name: "Free Courses", path: "/courses" },
  { name: "Study Resources", path: "/resources" },
  { name: "Apply", path: "/apply" },
  { name: "Contact", path: "/contact" },
  { name: "About", path: "/about" },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">
                ISF Learning Hub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-1 ml-2">
                      <Link to="/profile">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <User className="w-4 h-4" />
                          Profile
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" size="sm" className="ml-2 gap-1.5">
                          <LogIn className="w-4 h-4" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="sm" className="gap-1.5">
                          <UserPlus className="w-4 h-4" />
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border bg-card">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!loading && (
                <div className="border-t border-border pt-2 mt-2 space-y-2">
                  {user ? (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://whatsapp.com/channel/0029VauLh2hFXUucg7QyOg2r"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[hsl(142,70%,45%)] px-5 py-3 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Join our WhatsApp channel"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Join WhatsApp</span>
      </a>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="font-serif font-bold text-lg">ISF Learning Hub</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Join, Learn, Share, and Grow Together. Empowering students worldwide with educational opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Opportunities</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/scholarships" className="hover:text-primary-foreground">Scholarships</Link></li>
                <li><Link to="/internships" className="hover:text-primary-foreground">Internships</Link></li>
                <li><Link to="/courses" className="hover:text-primary-foreground">Free Courses</Link></li>
                <li><Link to="/webinars" className="hover:text-primary-foreground">Webinars</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/resources" className="hover:text-primary-foreground">Study Materials</Link></li>
                <li><Link to="/apply" className="hover:text-primary-foreground">Application Guide</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Subscribe to get the latest opportunities
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/50"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            © 2024 ISF Learning Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
