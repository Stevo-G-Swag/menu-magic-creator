import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
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
              <Link to="/create">Create Menu</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/templates">Browse Templates</Link>
            </Button>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside text-left">
              <li>Choose a template or start from scratch</li>
              <li>Customize your menu with agents and tools</li>
              <li>Preview and generate your OLLAMA mode menu</li>
              <li>Test your menu in our interactive sandbox</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;