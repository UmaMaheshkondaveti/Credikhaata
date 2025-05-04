
// Function to download chat history as a text file
export function downloadChatHistory(userId) { // Added userId parameter
  if (!userId) {
      console.error("User ID is required to export chat history.");
      // Optionally show a toast message to the user
      return;
  }

  const storedMessages = localStorage.getItem(`chat_${userId}`);
  if (!storedMessages) {
     console.warn("No chat history found for this user.");
      // Optionally show a toast message to the user
     return;
  }

  let messages = [];
  try {
     messages = JSON.parse(storedMessages);
  } catch (e) {
     console.error("Failed to parse chat history from localStorage", e);
      // Optionally show a toast message to the user
     return;
  }


  if (!Array.isArray(messages) || messages.length === 0) {
    console.warn("Chat history is empty or invalid.");
     // Optionally show a toast message to the user
    return;
  }

  // Format messages for export
  const formattedMessages = messages.map(msg => {
    const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
    const time = new Date(msg.timestamp).toLocaleString();
    return `${time} - ${sender}: ${msg.content}`;
  }).join('\n\n');

  const header = `AI Customer Support Chat History (User ID: ${userId})\n`;
  const timestamp = new Date().toLocaleString();
  const footer = `\n\nExported on: ${timestamp}`;

  const content = header + "=".repeat(50) + "\n\n" + formattedMessages + footer;

  // Create file and trigger download
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Generate filename with date
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `ai-chat-history-${userId}-${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
      console.error("Failed to trigger chat history download:", e);
       // Optionally show a toast message to the user
  }
}
  