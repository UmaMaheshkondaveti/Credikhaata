
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";


const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-5 w-5', // Slightly smaller
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
    </div>
  );
};

export default LoadingSpinner;
  