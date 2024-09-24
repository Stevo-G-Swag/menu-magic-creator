import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const templates = [
  {
    id: 1,
    name: "Basic Chat Assistant",
    description: "A simple chat interface with a single AI assistant.",
    agents: [
      { name: "Chat Assistant", description: "A general-purpose AI assistant capable of engaging in conversations on various topics." }
    ],
    tools: [
      { name: "Web Search", description: "Search the internet for up-to-date information on any topic." },
      { name: "Text Summarization", description: "Summarize long pieces of text into concise summaries." }
    ],
    customizations: {
      theme: "light",
      language: "English",
      maxResponseTokens: 150
    }
  },
  {
    id: 2,
    name: "Task Management",
    description: "An AI-powered task manager with multiple specialized agents.",
    agents: [
      { name: "Task Organizer", description: "Helps organize and prioritize tasks based on urgency and importance." },
      { name: "Reminder Bot", description: "Sends timely reminders for upcoming tasks and deadlines." }
    ],
    tools: [
      { name: "Calendar Integration", description: "Sync tasks with your calendar for better time management." },
      { name: "Priority Sorting", description: "Sort tasks by importance and urgency using AI algorithms." },
      { name: "Task Breakdown", description: "Break down complex tasks into manageable subtasks." }
    ],
    customizations: {
      theme: "dark",
      language: "English",
      notificationPreference: "email"
    }
  },
  {
    id: 3,
    name: "Advanced Research Framework",
    description: "A comprehensive research assistant with multiple specialized agents.",
    agents: [
      { name: "Literature Reviewer", description: "Analyzes and summarizes academic papers and research articles." },
      { name: "Data Analyst", description: "Processes and interprets complex datasets, providing statistical insights." },
      { name: "Hypothesis Generator", description: "Proposes new research hypotheses based on existing findings and data patterns." }
    ],
    tools: [
      { name: "Academic Database Access", description: "Search and retrieve scholarly articles from various academic databases." },
      { name: "Statistical Analysis", description: "Perform advanced statistical tests and data modeling." },
      { name: "Visualization Creator", description: "Generate charts, graphs, and other visualizations from research data." },
      { name: "Citation Manager", description: "Organize and format citations in various academic styles." }
    ],
    customizations: {
      theme: "light",
      language: "English",
      citationStyle: "APA"
    }
  },
  {
    id: 4,
    name: "Multi-Agent Coding Assistant",
    description: "A collaborative coding environment with specialized programming agents.",
    agents: [
      { name: "Code Generator", description: "Generates boilerplate and common code patterns based on project requirements." },
      { name: "Code Reviewer", description: "Analyzes code for best practices, potential issues, and suggests improvements." },
      { name: "Refactoring Expert", description: "Suggests and implements code refactoring to improve code quality and maintainability." },
      { name: "Documentation Writer", description: "Generates and updates code documentation, including inline comments and README files." }
    ],
    tools: [
      { name: "Syntax Highlighter", description: "Provides syntax highlighting for multiple programming languages." },
      { name: "Version Control", description: "Integrates with Git for code versioning and collaboration." },
      { name: "Code Formatter", description: "Automatically formats code to project-specific or language-specific standards." },
      { name: "Dependency Analyzer", description: "Analyzes and manages project dependencies, suggesting updates and identifying conflicts." }
    ],
    customizations: {
      theme: "dark",
      language: "JavaScript",
      frameworkPreference: "React"
    }
  },
  {
    id: 5,
    name: "AI-Powered Content Creation Suite",
    description: "A comprehensive toolkit for creating various types of content.",
    agents: [
      { name: "Article Writer", description: "Generates well-structured articles on various topics, adapting to different writing styles." },
      { name: "Social Media Manager", description: "Creates and schedules engaging social media posts across multiple platforms." },
      { name: "SEO Optimizer", description: "Enhances content for better search engine rankings and visibility." },
      { name: "Content Editor", description: "Proofreads and refines generated content for grammar, style, and tone consistency." }
    ],
    tools: [
      { name: "Keyword Research", description: "Identifies relevant keywords and phrases for content optimization." },
      { name: "Image Generator", description: "Creates custom images and graphics using AI-powered tools." },
      { name: "Content Calendar", description: "Manages and schedules content publication across various channels." },
      { name: "Sentiment Analyzer", description: "Analyzes the emotional tone of content to ensure it matches the intended audience." }
    ],
    customizations: {
      theme: "light",
      language: "English",
      contentTypes: ["blog", "social", "email"]
    }
  },
  // Add more templates here...
];

const TemplateSelector = ({ onSelectTemplate }) => {
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
