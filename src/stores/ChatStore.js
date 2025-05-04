
import { makeAutoObservable, runInAction } from 'mobx';

class ChatStore {
  messages = [];
  isTyping = false;
  userId = null;

  constructor() {
    makeAutoObservable(this);
    // Delay loading until userId is known
  }

  initialize(userId) {
    if (!userId || this.userId === userId) return; // Don't re-initialize if userId hasn't changed
    this.userId = userId;
    this.loadMessages();
  }

  loadMessages() {
    if (!this.userId) return;
    const storedMessages = localStorage.getItem(`chat_${this.userId}`);
    runInAction(() => {
      if (storedMessages) {
        try {
            this.messages = JSON.parse(storedMessages);
        } catch (e) {
            console.error("Failed to parse messages from localStorage", e);
            this.messages = [];
            localStorage.removeItem(`chat_${this.userId}`);
        }
      } else {
        this.messages = []; // Ensure messages is an empty array if nothing is stored
      }
    });
  }

  saveMessages() {
    if (!this.userId) return;
    // Debounce saving? For now, save immediately.
    localStorage.setItem(`chat_${this.userId}`, JSON.stringify(this.messages));
  }

  addMessage(message) {
    this.messages.push(message);
    this.saveMessages();
  }

  setTyping(status) {
     runInAction(() => {
        this.isTyping = status;
     });
  }

  clearMessages() {
    this.messages = [];
    this.saveMessages();
  }

  async sendMessage(content) {
    if (!this.userId) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    this.addMessage(userMessage);

    this.setTyping(true);

    try {
      // Simulate API call delay for bot response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const botResponse = this.generateBotResponse(content);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

       runInAction(() => {
          this.addMessage(botMessage);
       });

    } catch (error) {
      console.error('Error sending message:', error);
       // Optionally add an error message to the chat
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I couldn't process that response. Please try again.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true // Custom flag
        };
        runInAction(() => {
            this.addMessage(errorMessage);
        });

    } finally {
      this.setTyping(false);
    }
  }

  generateBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (lowerCaseMessage.includes('help')) {
      return "I'm here to assist you. What seems to be the problem?";
    } else if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('cost')) {
      return "Our plans start at $19/month for Basic, $49/month for Pro. Visit our pricing page for more details!";
    } else if (lowerCaseMessage.includes('feature')) {
      return "We offer real-time chat, automated responses, and analytics. Which feature interests you most?";
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! Let me know if there's anything else.";
    } else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye')) {
      return "Goodbye! Have a great day!";
    } else if (lowerCaseMessage.includes('how are you')) {
       return "I'm just a program, but I'm running smoothly! How can I help?";
    } else {
      // Slightly more varied default response
      const responses = [
        "That's an interesting point. Could you tell me more?",
        "I see. Let me check on that for you.",
        "Understood. What specific details are you looking for?",
        "Thanks for sharing. How can I assist further with that?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

   // Reset store state on logout
   reset() {
     runInAction(() => {
       this.messages = [];
       this.isTyping = false;
       this.userId = null;
     });
   }
}

const chatStore = new ChatStore();
export default chatStore;
  