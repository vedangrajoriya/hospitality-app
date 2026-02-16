import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/booking', label: 'Book Now' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    setIsMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHomePage ? "bg-transparent" : "bg-card/95 backdrop-blur-md shadow-soft"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="font-display text-xl text-accent-foreground font-bold">H</span>
            </div>
            <span className={cn(
              "font-display text-xl font-semibold tracking-wide",
              isHomePage ? "text-cream" : "text-foreground"
            )}>
              Haven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "font-medium transition-colors relative",
                  isHomePage 
                    ? "text-cream/80 hover:text-cream" 
                    : "text-muted-foreground hover:text-foreground",
                  location.pathname === link.href && (isHomePage ? "text-cream" : "text-foreground")
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className={cn(
                  "text-sm",
                  isHomePage ? "text-cream/80" : "text-muted-foreground"
                )}>
                  {user.email}
                </span>
                <Button 
                  variant={isHomePage ? "hero-outline" : "outline"} 
                  size="sm" 
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant={isHomePage ? "hero-outline" : "outline"} 
                size="sm" 
                asChild
              >
                <Link to="/login">
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button 
              variant={isHomePage ? "hero" : "gold"} 
              size="sm" 
              asChild
            >
              <Link to="/booking">
                <Calendar className="w-4 h-4 mr-1" />
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isHomePage 
                ? "text-cream hover:bg-cream/10" 
                : "text-foreground hover:bg-muted"
            )}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md shadow-elevated border-t border-border animate-fade-in">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-colors",
                    location.pathname === link.href 
                      ? "bg-accent/10 text-accent" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                {user ? (
                  <Button variant="outline" className="flex-1" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4 mr-1" />
                      Sign In
                    </Link>
                  </Button>
                )}
                <Button variant="gold" className="flex-1" asChild>
                  <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                    <Calendar className="w-4 h-4 mr-1" />
                    Book
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
