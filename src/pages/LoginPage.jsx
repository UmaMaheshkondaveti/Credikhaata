
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, BookOpenCheck } from 'lucide-react'; // Changed icon
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Use Card

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loading) {
      login(email, password);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5">
       <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md" // Use Card width
       >
         <Card className="shadow-xl">
           <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
                <BookOpenCheck className="w-12 h-12 text-primary" />
             </div>
             <CardTitle className="text-2xl">Welcome Back to CrediKhaata</CardTitle>
             <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1.5">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email" // Changed type to email
                   placeholder="shopkeeper@example.com" // Updated placeholder
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   disabled={loading}
                 />
               </div>

               <div className="space-y-1.5">
                 <Label htmlFor="password">Password</Label>
                 <Input
                   id="password"
                   type="password"
                   placeholder="Your Password" // Updated placeholder
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   disabled={loading}
                 />
               </div>

               <Button
                 type="submit"
                 className="w-full"
                 disabled={loading || !email || !password}
               >
                 {loading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Signing In...
                   </>
                 ) : (
                   'Sign In'
                 )}
               </Button>
             </form>
           </CardContent>
           <CardFooter className="text-center text-sm flex justify-center">
             <span className="text-muted-foreground">Don't have an account?&nbsp;</span>
             <Link to="/signup" className="font-medium text-primary hover:underline">
               Sign Up
             </Link>
           </CardFooter>
         </Card>
       </motion.div>
     </div>
  );
};

export default LoginPage;
  