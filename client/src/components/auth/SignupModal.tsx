import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, registerUser } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { XIcon } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (!termsAgreed) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await dispatch(registerUser({
        name: `${firstName} ${lastName}`,
        email,
        username,
        password
      })).unwrap();
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setTermsAgreed(false);
      
      onClose();
      toast({
        title: "Success",
        description: "Your account has been created",
      });
    } catch (error) {
      // The error will be handled in the component via the error state
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-medium text-gray-900">Create an Account</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 p-0">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signup-firstname" className="mb-1">First Name</Label>
              <Input
                type="text"
                id="signup-firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={loading}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-lastname" className="mb-1">Last Name</Label>
              <Input
                type="text"
                id="signup-lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="signup-email" className="mb-1">Email</Label>
            <Input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="signup-username" className="mb-1">Username</Label>
            <Input
              type="text"
              id="signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="signup-password" className="mb-1">Password</Label>
            <Input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="signup-confirm-password" className="mb-1">Confirm Password</Label>
            <Input
              type="password"
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms-agreement" 
                checked={termsAgreed} 
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                disabled={loading}
                required
              />
              <Label htmlFor="terms-agreement" className="text-sm text-gray-700">
                I agree to the <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">Privacy Policy</Button>
              </Label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <Button 
            type="button" 
            variant="link" 
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
