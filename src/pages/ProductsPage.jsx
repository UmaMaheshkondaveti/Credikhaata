
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError("Could not load products. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

      {/* Add Filtering/Sorting controls here later */}

      {loading && <LoadingSpinner size="lg" />}

      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Loading Products</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
  