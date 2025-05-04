
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=4'); // Fetch 4 products as featured
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
         console.error("Failed to fetch featured products:", e);
         setError("Could not load featured products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>

        {loading && <LoadingSpinner />}

        {error && (
           <Alert variant="destructive" className="max-w-xl mx-auto">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
  