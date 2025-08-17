
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from '@/components/search/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Menu, 
  X,
  BarChart3,
  TrendingUp,
  Globe,
  Zap,
  LogOut,
  LogIn
} from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Markets', path: '/markets', icon: BarChart3, public: true },
    { name: 'Trading', path: '/dashboard', icon: TrendingUp, public: false },
    { name: 'Analytics', path: '/analysis', icon: Globe, public: false },
    { name: 'Portfolio', path: '/portfolio', icon: Zap, public: false },
  ];

  // Filter navigation items based on authentication status
  const visibleNavItems = navItems.filter(item => item.public || currentUser);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/favicon.ico" 
                      alt="DevXTrade Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary to-success rounded-xl opacity-30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <span className="text-2xl font-bold text-foreground font-display tracking-tight">
                  DevX<span className="text-primary">Trade</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {visibleNavItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        className={`
                          relative px-6 py-3 rounded-xl text-base font-medium transition-all duration-300
                          ${isActive 
                            ? 'text-primary bg-primary/10 shadow-lg' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5"
                            layoutId="activeNav"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Search Bar */}
            <motion.div
              className="hidden md:flex items-center max-w-md flex-1 mx-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SearchBar className="w-full" />
            </motion.div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {currentUser ? (
                <>
                  {/* Notifications - only show when logged in and on larger screens */}
                  <motion.div
                    className="hidden sm:block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                    >
                      <Bell className="h-5 w-5" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </Button>
                  </motion.div>

                  {/* Settings - only show when logged in and on larger screens */}
                  <motion.div
                    className="hidden sm:block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/settings">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Profile Dropdown - only show when logged in */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-success/20 backdrop-blur-sm border border-primary/30 hover:from-primary/30 hover:to-success/30 transition-all duration-300"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.photoURL || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-success text-white text-sm">
                              {currentUser.displayName 
                                ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                                : currentUser.email?.[0]?.toUpperCase() || 'U'
                              }
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 max-w-xs" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1 min-w-0">
                            <p className="text-sm font-medium leading-none truncate">
                              {currentUser.displayName || 'DevX Trader'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/portfolio" className="cursor-pointer">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span>Portfolio</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onSelect={(event) => {
                            event.preventDefault();
                            handleLogout();
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  {/* Logout */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-destructive/30 hover:bg-destructive/10 transition-all duration-300"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Login/Signup buttons when not logged in */}
                  <motion.div
                    className="hidden sm:block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/signup">
                      <Button
                        size="sm"
                        className="rounded-xl bg-gradient-to-br from-primary to-success hover:from-primary/90 hover:to-success/90 transition-all duration-300"
                      >
                        <span className="hidden sm:inline">Sign Up</span>
                        <span className="sm:hidden">Join</span>
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Mobile menu button */}
              <motion.div
                className="lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed top-20 right-6 left-6 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 lg:hidden overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="p-6 space-y-4">
                {/* Mobile Search */}
                <SearchBar 
                  className="md:hidden" 
                  placeholder="Search markets..."
                  onResultClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Navigation Items */}
                <div className="space-y-2">
                  {visibleNavItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={`
                              w-full justify-start px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
                              ${isActive 
                                ? 'text-primary bg-primary/10 border border-primary/20' 
                                : 'text-foreground hover:bg-background/50'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {item.name}
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Mobile auth buttons */}
                  {!currentUser && (
                    <div className="space-y-2 pt-4 border-t border-border/30">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 rounded-xl text-base font-medium transition-all duration-300"
                        >
                          <LogIn className="h-5 w-5 mr-3" />
                          Login
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          className="w-full justify-start px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-br from-primary to-success"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Mobile logout button */}
                  {currentUser && (
                    <div className="pt-4 border-t border-border/30">
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
