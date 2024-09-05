import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Github, Apple, Mail } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if it's the first-time admin login
    const checkFirstTimeLogin = async () => {
      const response = await fetch('/api/admin/check-first-login');
      if (response.ok) {
        const { isFirstLogin } = await response.json();
        if (isFirstLogin) {
          navigate('/admin/first-login');
        }
      }
    };
    checkFirstTimeLogin();
  }, [navigate]);

  const handleAuth = async (action) => {
    try {
      const response = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} Successful`,
          description: `Welcome ${data.user.email}!`,
        });
        navigate('/');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOAuthSignIn = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleAuth('login'); }} className="space-y-4">
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
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="mt-4 space-y-2">
          <Button onClick={() => handleOAuthSignIn('github')} variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button onClick={() => handleOAuthSignIn('google')} variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button onClick={() => handleOAuthSignIn('apple')} variant="outline" className="w-full">
            <Apple className="mr-2 h-4 w-4" />
            Sign in with Apple
          </Button>
        </div>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-500 hover:underline">Don't have an account? Sign up</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default Auth;