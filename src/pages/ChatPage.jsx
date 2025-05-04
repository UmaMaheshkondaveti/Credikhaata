
import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import ChatHeader from '@/components/ChatHeader';
import ChatHistory from '@/components/ChatHistory';
import ChatInput from '@/components/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import chatStore from '@/stores/ChatStore';

const ChatPage = observer(() => {
  const { user } = useAuth();

  // Initialize chat store with user ID when user data is available
  useEffect(() => {
    if (user?.id) {
      chatStore.initialize(user.id);
    }
     // Cleanup on unmount or when user changes
     return () => {
        // Potentially reset store if needed when navigating away while logged in
        // chatStore.reset(); // Decide if reset is needed here or only on logout
     };
  }, [user?.id]);

  // Memoize messages to prevent unnecessary re-renders of ChatHistory
   const messages = useMemo(() => chatStore.messages.slice(), [chatStore.messages]);


  const handleSendMessage = (content) => {
    chatStore.sendMessage(content);
  };

  // Auth guard is handled by ProtectedRoute, so no need for navigate here

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="chat-container flex flex-col h-screen"
    >
      <ChatHeader />

      <ChatHistory
        messages={messages} // Use memoized messages
        isTyping={chatStore.isTyping}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={chatStore.isTyping}
      />
    </motion.div>
  );
});

export default ChatPage;
  