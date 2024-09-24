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
  {
    id: 3,
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
  },
  {
    id: 4,
    name: "Multi-Agent Coding Assistant",
    description: "A collaborative coding environment with specialized programming agents.",
    agents: [
      { name: "Code Generator", description: "Generates boilerplate and common code patterns" },
      { name: "Code Reviewer", description: "Analyzes code for best practices and potential issues" },
      { name: "Refactoring Expert", description: "Suggests and implements code refactoring" }
    ],
    tools: [
      { name: "Syntax Highlighter", description: "Provides syntax highlighting for multiple languages" },
      { name: "Version Control", description: "Integrates with Git for code versioning" },
      { name: "Code Formatter", description: "Automatically formats code to project standards" }
    ]
  },
  {
    id: 5,
    name: "AI-Powered Content Creation Suite",
    description: "A comprehensive toolkit for creating various types of content.",
    agents: [
      { name: "Article Writer", description: "Generates well-structured articles on various topics" },
      { name: "Social Media Manager", description: "Creates and schedules social media posts" },
      { name: "SEO Optimizer", description: "Enhances content for better search engine rankings" }
    ],
    tools: [
      { name: "Keyword Research", description: "Identifies relevant keywords for content optimization" },
      { name: "Image Generator", description: "Creates custom images using AI" },
      { name: "Content Calendar", description: "Manages and schedules content publication" }
    ]
  },
  {
    id: 6,
    name: "Virtual Event Planner",
    description: "An AI-driven system for planning and managing virtual events.",
    agents: [
      { name: "Event Coordinator", description: "Oversees the overall event planning process" },
      { name: "Speaker Liaison", description: "Manages communication with event speakers" },
      { name: "Technical Support", description: "Handles technical aspects of virtual events" }
    ],
    tools: [
      { name: "Schedule Optimizer", description: "Creates optimal event schedules" },
      { name: "Virtual Venue Designer", description: "Designs interactive virtual event spaces" },
      { name: "Attendee Engagement Tracker", description: "Monitors and analyzes attendee participation" }
    ]
  },
  {
    id: 7,
    name: "AI Language Learning Assistant",
    description: "A personalized language learning system with multiple AI tutors.",
    agents: [
      { name: "Grammar Coach", description: "Explains and corrects grammatical errors" },
      { name: "Vocabulary Builder", description: "Introduces and reinforces new vocabulary" },
      { name: "Conversation Partner", description: "Engages in dialogue to improve speaking skills" }
    ],
    tools: [
      { name: "Pronunciation Analyzer", description: "Provides feedback on pronunciation" },
      { name: "Custom Lesson Creator", description: "Generates personalized language lessons" },
      { name: "Progress Tracker", description: "Monitors and reports on learning progress" }
    ]
  },
  {
    id: 8,
    name: "Intelligent Financial Advisor",
    description: "A comprehensive financial planning and investment management system.",
    agents: [
      { name: "Budget Analyst", description: "Helps create and manage personal or business budgets" },
      { name: "Investment Strategist", description: "Provides investment recommendations based on goals and risk tolerance" },
      { name: "Tax Planning Expert", description: "Offers guidance on tax-efficient financial strategies" }
    ],
    tools: [
      { name: "Market Data Aggregator", description: "Collects and analyzes financial market data" },
      { name: "Portfolio Simulator", description: "Simulates potential investment outcomes" },
      { name: "Financial Goal Tracker", description: "Monitors progress towards financial objectives" }
    ]
  },
  {
    id: 9,
    name: "AI-Driven Health and Wellness Coach",
    description: "A personalized health management system with multiple specialized agents.",
    agents: [
      { name: "Nutrition Advisor", description: "Provides dietary recommendations and meal planning" },
      { name: "Fitness Trainer", description: "Creates and adapts workout routines" },
      { name: "Mental Health Support", description: "Offers stress management and emotional support" }
    ],
    tools: [
      { name: "Biometric Data Analyzer", description: "Interprets health data from wearable devices" },
      { name: "Meditation Guide", description: "Provides guided meditation sessions" },
      { name: "Sleep Pattern Optimizer", description: "Analyzes and suggests improvements for sleep habits" }
    ]
  },
  {
    id: 10,
    name: "Automated Customer Service Platform",
    description: "An AI-powered customer support system with multiple specialized agents.",
    agents: [
      { name: "Inquiry Classifier", description: "Categorizes and routes customer inquiries" },
      { name: "Resolution Specialist", description: "Handles and resolves customer issues" },
      { name: "Feedback Analyzer", description: "Processes and interprets customer feedback" }
    ],
    tools: [
      { name: "Knowledge Base Manager", description: "Maintains and updates support documentation" },
      { name: "Sentiment Analyzer", description: "Assesses customer sentiment in interactions" },
      { name: "Escalation Predictor", description: "Identifies issues likely to require escalation" }
    ]
  },
  {
    id: 11,
    name: "AI Game Master",
    description: "An advanced system for running and managing tabletop role-playing games.",
    agents: [
      { name: "Narrative Weaver", description: "Generates and adapts storylines based on player actions" },
      { name: "Character Manager", description: "Tracks and evolves non-player characters" },
      { name: "Rules Arbiter", description: "Interprets and applies game rules consistently" }
    ],
    tools: [
      { name: "Dynamic Map Creator", description: "Generates and modifies game maps in real-time" },
      { name: "Encounter Balancer", description: "Adjusts difficulty of encounters based on party composition" },
      { name: "Loot Generator", description: "Creates appropriate rewards for player achievements" }
    ]
  },
  {
    id: 12,
    name: "AI-Powered Legal Assistant",
    description: "A comprehensive legal research and document preparation system.",
    agents: [
      { name: "Case Law Researcher", description: "Finds relevant legal precedents and statutes" },
      { name: "Document Drafter", description: "Assists in preparing legal documents and contracts" },
      { name: "Legal Strategy Advisor", description: "Suggests potential legal strategies based on case details" }
    ],
    tools: [
      { name: "Citation Checker", description: "Verifies and formats legal citations" },
      { name: "Conflict Checker", description: "Identifies potential conflicts of interest" },
      { name: "Legal Deadline Tracker", description: "Manages important legal deadlines and filing dates" }
    ]
  },
  {
    id: 13,
    name: "Intelligent Music Production Suite",
    description: "An AI-driven system for composing, arranging, and producing music.",
    agents: [
      { name: "Melody Generator", description: "Creates original melodies based on genre and style preferences" },
      { name: "Harmony Arranger", description: "Develops harmonic progressions and arrangements" },
      { name: "Mix Engineer", description: "Balances and enhances individual tracks in a composition" }
    ],
    tools: [
      { name: "Virtual Instrument Library", description: "Provides a wide range of software instruments" },
      { name: "Chord Progression Analyzer", description: "Suggests and analyzes chord progressions" },
      { name: "Automated Mastering", description: "Applies final polish to completed tracks" }
    ]
  }
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
