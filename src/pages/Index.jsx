import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      localStorage.removeItem('selectedTemplate');
      navigate('/create', { state: { template: JSON.parse(selectedTemplate) } });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome to AgentForge</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Create advanced OLLAMA mode menus with agents and selectable tools using AI-powered code generation.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/create">Create Menu</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/templates">Browse Templates</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;