
import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';

const ChatHistory = observer(({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll on new messages or typing indicator change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

   // Scroll on initial load (after messages are loaded)
   useEffect(() => {
     if (messages.length > 0) {
       setTimeout(scrollToBottom, 100); // Small delay for rendering
     }
   }, []); // Only on initial mount


  return (
    <div className="flex-1 overflow-y-auto p-4 pb-6"> {/* Added padding bottom */}
      {messages.length === 0 && !isTyping ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <img  class="w-10 h-10 opacity-50" alt="Empty chat icon" src="https://images.unsplash.com/photo-1684835609054-dd3d681cf012" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-foreground">Start the Conversation</h3>
          <p className="max-w-xs">
            Ask the AI assistant anything about our services or how we can help you.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </>
      )}
      <div ref={messagesEndRef} className="h-1" /> {/* Invisible element to scroll to */}
    </div>
  );
});

export default ChatHistory;
  