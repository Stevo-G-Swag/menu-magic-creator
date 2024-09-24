import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ErrorBoundary from '../components/ErrorBoundary';

const fetchAgents = async () => {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

const solveProblem = async (problemData) => {
  const response = await fetch('/api/solve-problem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(problemData),
  });
  if (!response.ok) {
    throw new Error('Failed to solve problem');
  }
  return response.json();
};

const Collaboration = () => {
  const [problem, setProblem] = useState('');
  const { toast } = useToast();

  const { data: agents, isLoading: agentsLoading, error: agentsError } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    retry: 3,
    retryDelay: 1000,
  });

  const solveProblemMutation = useMutation({
    mutationFn: solveProblem,
    onSuccess: (data) => {
      toast({
        title: "Problem Solved",
        description: "The agents have collaborated to solve the problem.",
      });
      console.log(data.solution);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to solve problem: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSolveProblem = (e) => {
    e.preventDefault();
    solveProblemMutation.mutate({ problem, agents: agents.map(agent => agent.id) });
  };

  if (agentsLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (agentsError) return <div>Error loading agents: {agentsError.message}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Agent Collaboration</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Solve a Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSolveProblem} className="space-y-4">
              <Input
                placeholder="Describe the problem to solve"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              />
              <Button 
                type="submit"
                disabled={solveProblemMutation.isLoading}
              >
                {solveProblemMutation.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Collaborate to Solve
              </Button>
            </form>
          </CardContent>
        </Card>
        <h2 className="text-xl font-semibold mb-2">Available Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents && agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{agent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Collaboration;
