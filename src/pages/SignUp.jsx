import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Github, Apple, Mail } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: "Sign Up Successful",
          description: `Welcome ${data.user.email}!`,
        });
        navigate('/');
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOAuthSignUp = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <div className="mt-4 space-y-2">
          <Button onClick={() => handleOAuthSignUp('github')} variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
          <Button onClick={() => handleOAuthSignUp('google')} variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
          <Button onClick={() => handleOAuthSignUp('apple')} variant="outline" className="w-full">
            <Apple className="mr-2 h-4 w-4" />
            Sign up with Apple
          </Button>
        </div>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">Already have an account? Log in</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUp;