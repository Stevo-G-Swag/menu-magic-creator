import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const { toast } = useToast();

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      return response.json();
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: async (newAgent) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });
      if (!response.ok) {
        throw new Error('Failed to create agent');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agent Created",
        description: "Your new agent has been successfully created.",
      });
      setAgentName('');
      setAgentDescription('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create agent: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateAgent = (e) => {
    e.preventDefault();
    createAgentMutation.mutate({ name: agentName, description: agentDescription });
  };

  if (isLoading) return <div>Loading agents...</div>;
  if (error) return <div>Error loading agents: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Builder</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAgent} className="space-y-4">
            <Input
              placeholder="Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
            />
            <Input
              placeholder="Agent Description"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              required
            />
            <Button type="submit">Create Agent</Button>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-2">Existing Agents</h2>
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
  );
};

export default AgentBuilder;