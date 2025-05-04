
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
           {/* Replace with an actual logo later if desired */}
           <img  class="h-8 w-auto text-primary" alt="CrediKhaata Logo" src="https://images.unsplash.com/photo-1604594849809-dfedbc827105" />
          <span className="font-bold text-lg text-primary hidden sm:inline-block">
            CrediKhaata
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
           {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                   <Avatar className="h-9 w-9">
                       <AvatarFallback className="bg-primary/10 text-primary font-semibold border border-primary/20">{userInitial}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                   <User className="mr-2 h-4 w-4" />
                   <span>Profile</span>
                 </DropdownMenuItem> */}
                {/* Add more items like Settings later */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
  