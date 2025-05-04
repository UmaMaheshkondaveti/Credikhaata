
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserPlus } from 'lucide-react'; // Changed icon
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Use Card

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: "Passwords do not match.",
      });
      return;
    }
    if (!loading) {
      signup(name, email, password);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5">
       <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md"
       >
         <Card className="shadow-xl">
           <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
                <UserPlus className="w-12 h-12 text-primary" />
             </div>
             <CardTitle className="text-2xl">Create Your CrediKhaata Account</CardTitle>
             <CardDescription>Start managing your credit ledger easily.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1.5">
                 <Label htmlFor="name">Shopkeeper Name</Label>
                 <Input
                   id="name"
                   type="text"
                   placeholder="e.g., Anil Kumar"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                   disabled={loading}
                 />
               </div>

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
                   placeholder="Create a secure password" // Updated placeholder
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   disabled={loading}
                 />
               </div>

               <div className="space-y-1.5">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <Input
                   id="confirmPassword"
                   type="password"
                   placeholder="Re-enter your password" // Updated placeholder
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   required
                   disabled={loading}
                 />
                 {password && confirmPassword && password !== confirmPassword && (
                   <p className="text-xs text-destructive pt-1">Passwords do not match.</p>
                 )}
               </div>

               <Button
                 type="submit"
                 className="w-full"
                 disabled={loading || !name || !email || !password || password !== confirmPassword}
               >
                 {loading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Creating Account...
                   </>
                 ) : (
                   'Sign Up'
                 )}
               </Button>
             </form>
           </CardContent>
           <CardFooter className="text-center text-sm flex justify-center">
             <span className="text-muted-foreground">Already have an account?&nbsp;</span>
             <Link to="/login" className="font-medium text-primary hover:underline">
               Sign In
             </Link>
           </CardFooter>
         </Card>
       </motion.div>
     </div>
  );
};

export default SignupPage;
  