
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
// Import other sections as needed

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      {/* Add other sections like Categories, Testimonials, etc. */}
      {/* Example: <CategoriesSection /> */}
      {/* Example: <NewsletterSignup /> */}
    </div>
  );
};

export default HomePage;
  