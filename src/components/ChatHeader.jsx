
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Download } from 'lucide-react'; // Changed MoreVertical to Settings
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { downloadChatHistory } from '@/lib/export';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const ChatHeader = () => {
  const { user, logout } = useAuth();

  const handleExport = () => {
    downloadChatHistory(user?.id); // Pass user ID for correct export
  };

   const userInitial = user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-3 border-b bg-background/90 backdrop-blur-sm sticky top-0 z-10 h-16" // Added height
    >
      {/* Left Side: Bot Info */}
      <div className="flex items-center">
         <img  class="w-10 h-10 rounded-full mr-3 object-cover" alt="AI Assistant Avatar" src="https://images.unsplash.com/photo-1684369176170-463e84248b70" />
        <div>
          <h2 className="font-semibold text-base">AI Support Assistant</h2>
          <p className="text-xs text-green-600">Online</p> {/* Changed color */}
        </div>
      </div>

      {/* Right Side: User Actions */}
      <div className="flex items-center space-x-2">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon" title="Options">
                 <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <span>Download Chat</span>
            </DropdownMenuItem>
            {/* Add more options later if needed */}
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
               <LogOut className="mr-2 h-4 w-4" />
               <span>Logout</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

         <Avatar className="h-9 w-9 cursor-default border" title={user?.name || user?.username}>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{userInitial}</AvatarFallback>
         </Avatar>

      </div>
    </motion.div>
  );
};

export default ChatHeader;
  