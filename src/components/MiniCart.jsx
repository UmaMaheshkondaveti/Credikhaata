
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea exists or create it
import { Trash2 } from 'lucide-react';

const MiniCart = () => {
  const { cartItems, getCartTotal, removeFromCart, getCartItemCount } = useCart();
  const totalItems = getCartItemCount();
  const subtotal = getCartTotal();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Shopping Cart ({totalItems})</h3>
      {cartItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
      ) : (
        <>
          {/* Assuming ScrollArea component exists or is created */}
          {/* <ScrollArea className="h-[250px] pr-4 mb-4"> */}
          <div className="max-h-[250px] overflow-y-auto pr-4 mb-4 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-3">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-contain rounded border p-1"
                 src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* </ScrollArea> */}
          <Separator className="my-4" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link to="/cart">View Cart</Link>
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCart;
  