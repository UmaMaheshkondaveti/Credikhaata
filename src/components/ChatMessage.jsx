
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from '@/lib/date';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const ChatMessage = ({ message }) => {
  const { user } = useAuth(); // Get current user
  const isUser = message.sender === 'user';
  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] md:max-w-[75%]`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
              <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-indigo-600 text-white">AI</AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className={`mx-2 ${isUser ? 'mr-2' : 'ml-2'}`}>
          <div
            className={`px-4 py-3 ${
              isUser
                ? 'chat-bubble-user text-white'
                : 'chat-bubble-bot text-gray-800'
            } ${message.isError ? 'bg-red-100 border border-red-300 text-red-800' : ''}`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <p className={`text-[11px] text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatDistanceToNow(new Date(message.timestamp))}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
  