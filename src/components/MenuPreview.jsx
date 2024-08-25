import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MenuPreview = ({ title, agents, tools }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title || 'Menu Title'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Agents:</h3>
          <div className="space-y-2">
            {agents.map((agent, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="secondary">{agent.name}</Badge>
                {agent.description && (
                  <span className="text-sm text-gray-500">{agent.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Tools:</h3>
          <div className="space-y-2">
            {tools.map((tool, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="outline">{tool.name}</Badge>
                {tool.description && (
                  <span className="text-sm text-gray-500">{tool.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuPreview;