
import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 dark:bg-secondary/20">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container py-6 md:py-8" // Add padding
      >
        {children}
      </motion.main>
      {/* Footer can be added here if needed */}
      {/* <footer className="mt-auto p-4 text-center text-xs text-muted-foreground">
         CrediKhaata © {new Date().getFullYear()}
      </footer> */}
    </div>
  );
};

export default Layout;
  