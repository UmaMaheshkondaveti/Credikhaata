
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative hero-gradient py-20 md:py-32 overflow-hidden">
      <div className="container relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-gray-800"
        >
          Discover Your Style
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          Explore our curated collection of high-quality products designed to elevate your everyday life. Find exactly what you need, effortlessly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform transform hover:scale-105">
            <Link to="/products">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
      {/* Optional: Add background shapes/elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full opacity-30 -translate-x-1/4 -translate-y-1/4 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full opacity-30 translate-x-1/4 translate-y-1/4 filter blur-3xl"></div>
    </section>
  );
};

export default Hero;
  