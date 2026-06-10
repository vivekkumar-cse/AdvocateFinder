import { Scale, Menu, X, LogOut, User, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdvocateStatus } from '@/hooks/useAdvocateStatus';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { isAdvocate } = useAdvocateStatus();
  const { toast } = useToast();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/advocates', label: 'Find Advocates' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
    });
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Scale className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-foreground leading-tight">
                AdvocateFinder
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Find Legal Help</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : user ? (
              <>
                {isAdvocate && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/advocate-dashboard')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => navigate('/my-consultations')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  My Consultations
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  English
                </Button>
                <Button size="sm" onClick={() => navigate('/register-advocate')}>
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {isAdvocate && (
                      <Button variant="ghost" className="justify-start" onClick={() => { navigate('/advocate-dashboard'); setMobileMenuOpen(false); }}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start" onClick={() => { navigate('/my-consultations'); setMobileMenuOpen(false); }}>
                      <Calendar className="w-4 h-4 mr-2" />
                      My Consultations
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                      English
                    </Button>
                    <Button className="justify-start" onClick={() => { navigate('/register-advocate'); setMobileMenuOpen(false); }}>
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-secondary/10 border-t border-secondary/20">
        <div className="container mx-auto px-4 py-1.5">
          <p className="text-[11px] text-center text-muted-foreground">
            ⚠️ <strong>Disclaimer:</strong> This is a conceptual prototype for learning purposes only. Not a real legal service.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
