
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden">
             <img 
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out hover:scale-105"
              src="https://images.unsplash.com/photo-1674027392838-d85710a5121d" />
          </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-base font-medium mb-2 h-12 overflow-hidden">
            <Link to={`/products/${product.id}`} className="hover:text-primary line-clamp-2">
              {product.title}
            </Link>
          </CardTitle>
          <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full" variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
  