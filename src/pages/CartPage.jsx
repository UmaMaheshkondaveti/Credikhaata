
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const subtotal = getCartTotal();
  const shippingCost = subtotal > 50 ? 0 : 5.99; // Example shipping logic
  const total = subtotal + shippingCost;

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 0) { // Allow setting quantity to 0 to potentially remove
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">Your cart is currently empty.</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain rounded border p-2 mb-4 sm:mb-0 sm:mr-4 flex-shrink-0"
                 src="https://images.unsplash.com/photo-1642452222105-b2933e287da4" />
                <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                  <div className="mb-4 sm:mb-0 sm:mr-4">
                    <Link to={`/products/${item.id}`} className="font-medium hover:text-primary">{item.title}</Link>
                    <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between">
                    {/* Quantity Adjuster */}
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
             <Button variant="outline" onClick={clearCart} className="mt-4 text-destructive hover:bg-destructive/10">
                Clear Cart
             </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
  