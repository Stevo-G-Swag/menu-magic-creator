import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Github, Apple, Mail } from 'lucide-react';

const Auth = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log(`Auth component mounted. isLogin: ${isLogin}`);
    return () => {
      console.log('Auth component unmounted');
    };
  }, [isLogin]);

  const handleAuth = async (e) => {
    e.preventDefault();
    console.log(`Attempting to ${isLogin ? 'login' : 'sign up'} with email: ${email}`);
    
    if (!isLogin && password !== confirmPassword) {
      console.error('Password mismatch during sign up');
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      console.log(`Sending request to ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log(`Received response with status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Authentication successful', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('hasSignedUpBefore', 'true');
        toast({
          title: isLogin ? "Login Successful" : "Sign Up Successful",
          description: `Welcome ${data.user.email}!`,
        });
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || (isLogin ? 'Login failed' : 'Sign up failed'));
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOAuthSignIn = (provider) => {
    console.log(`Attempting OAuth sign-in with ${provider}`);
    // Simulating OAuth sign-in for demonstration purposes
    setTimeout(() => {
      console.log(`Simulated ${provider} sign-in successful`);
      localStorage.setItem('token', 'fake-oauth-token');
      localStorage.setItem('user', JSON.stringify({ email: `user@${provider}.com` }));
      localStorage.setItem('hasSignedUpBefore', 'true');
      toast({
        title: `${provider} Sign-In Successful`,
        description: `Welcome ${provider} user!`,
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
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
          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button type="submit" className="w-full">{isLogin ? "Login" : "Sign Up"}</Button>
        </form>
        <div className="mt-4 space-y-2">
          <Button onClick={() => handleOAuthSignIn('github')} variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            {isLogin ? "Login" : "Sign up"} with GitHub
          </Button>
          <Button onClick={() => handleOAuthSignIn('google')} variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            {isLogin ? "Login" : "Sign up"} with Google
          </Button>
          <Button onClick={() => handleOAuthSignIn('apple')} variant="outline" className="w-full">
            <Apple className="mr-2 h-4 w-4" />
            {isLogin ? "Login" : "Sign up"} with Apple
          </Button>
        </div>
        <div className="mt-4 text-center">
          {isLogin ? (
            <a href="/signup" className="text-blue-500 hover:underline">Don't have an account? Sign up</a>
          ) : (
            <a href="/login" className="text-blue-500 hover:underline">Already have an account? Log in</a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Auth;
