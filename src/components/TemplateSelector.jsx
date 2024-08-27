import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const templates = [
  {
    id: 1,
    name: "Basic Chat Assistant",
    description: "A simple chat interface with a single AI assistant.",
    agents: [{ name: "Chat Assistant", description: "A general-purpose AI assistant" }],
    tools: [{ name: "Web Search", description: "Search the internet for information" }]
  },
  {
    id: 2,
    name: "Task Management",
    description: "An AI-powered task manager with multiple specialized agents.",
    agents: [
      { name: "Task Organizer", description: "Helps organize and prioritize tasks" },
      { name: "Reminder Bot", description: "Sends reminders for upcoming tasks" }
    ],
    tools: [
      { name: "Calendar Integration", description: "Sync tasks with your calendar" },
      { name: "Priority Sorting", description: "Sort tasks by importance and urgency" }
    ]
  },
  // ... (adding 97 more template examples)
  {
    id: 100,
    name: "Advanced Research Framework",
    description: "A comprehensive research assistant with multiple specialized agents.",
    agents: [
      { name: "Literature Reviewer", description: "Analyzes and summarizes academic papers" },
      { name: "Data Analyst", description: "Processes and interprets complex datasets" },
      { name: "Hypothesis Generator", description: "Proposes new research hypotheses based on findings" }
    ],
    tools: [
      { name: "Academic Database Access", description: "Search and retrieve scholarly articles" },
      { name: "Statistical Analysis", description: "Perform advanced statistical tests" },
      { name: "Visualization Creator", description: "Generate charts and graphs from research data" }
    ]
  }
];

const TemplateSelector = ({ onSelectTemplate }) => {
  const handleSelectTemplate = (template) => {
    onSelectTemplate({
      title: template.name,
      agents: template.agents,
      tools: template.tools
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Agents:</h4>
              <ul className="list-disc pl-5">
                {template.agents.map((agent, index) => (
                  <li key={index}>{agent.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tools:</h4>
              <ul className="list-disc pl-5">
                {template.tools.map((tool, index) => (
                  <li key={index}>{tool.name}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={() => onSelectTemplate(template)} className="w-full">
              Use This Template
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;