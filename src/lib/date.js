
// Function to format date distance (e.g., "5 minutes ago")
export function formatDistanceToNow(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
   if (diffInDays < 7) { // Show days up to a week
     return rtf.format(-diffInDays, 'day');
   }

  // For older dates, show actual date
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // More complex logic can be added for weeks, months, years if needed
  // const diffInWeeks = Math.floor(diffInDays / 7);
  // if (diffInWeeks < 4) { // Example for weeks
  //   return rtf.format(-diffInWeeks, 'week');
  // }
  // ... and so on for months/years
}
  