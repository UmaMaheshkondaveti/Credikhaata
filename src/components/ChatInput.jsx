
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react'; // Removed Paperclip for simplicity
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-4 border-t bg-background/90 backdrop-blur-sm sticky bottom-0"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* Removed File Upload Button for simplicity */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input flex-1 py-3 h-11 rounded-full shadow-sm" // Adjusted styling
          disabled={disabled}
          autoComplete="off"
        />

        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0 h-11 w-11 shadow-md" // Adjusted styling
          disabled={!message.trim() || disabled}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatInput;
  