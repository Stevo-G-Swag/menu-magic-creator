import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const hasSignedUpBefore = localStorage.getItem('hasSignedUpBefore') === 'true';

  useEffect(() => {
    console.log('Index component mounted');
    console.log(`isAuthenticated: ${isAuthenticated}, hasSignedUpBefore: ${hasSignedUpBefore}`);

    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    } else if (hasSignedUpBefore) {
      console.log('User has signed up before, redirecting to login');
      navigate('/login');
    } else {
      console.log('New user, redirecting to signup');
      navigate('/signup');
    }

    return () => {
      console.log('Index component unmounted');
    };
  }, [isAuthenticated, hasSignedUpBefore, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Welcome to AgentForge</CardTitle>
          <CardDescription className="text-xl text-center mt-2">
            Create advanced OLLAMA mode menus with agents and selectable tools using AI-powered code generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center max-w-2xl mb-4">
            AgentForge simplifies the process of creating complex agent-based menus. Whether you're a developer, designer, or product manager, our intuitive interface helps you bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg">
              <a href="/create">Create Menu</a>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a href="/templates">Browse Templates</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
