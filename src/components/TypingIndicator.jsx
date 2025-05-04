
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-end mb-4" // Align with message bottom
    >
       <Avatar className="h-8 w-8 mr-2 border-2 border-background shadow-sm flex-shrink-0">
          <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
          <AvatarFallback className="bg-indigo-600 text-white">AI</AvatarFallback>
        </Avatar>

      <div className="chat-bubble-bot px-4 py-3">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
  