import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MenuPreview = ({ title, agents, tools, onUpdate }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const generateMenuItems = () => {
      const items = [
        {
          name: 'Agent Configuration',
          items: agents.map(agent => `Configure ${agent.name}`),
        },
        {
          name: 'Core Settings',
          items: ['API Key', 'Model Selection', 'Temperature'],
        },
        {
          name: 'Advanced Settings',
          items: ['Prompt Engineering', 'Context Window', 'Token Limit'],
        },
        {
          name: 'Tool Configuration',
          items: tools.map(tool => `Configure ${tool.name}`),
        },
      ];
      setMenuItems(items);
      onUpdate(items);
    };

    generateMenuItems();
  }, [title, agents, tools, onUpdate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title || 'Menu Title'}</CardTitle>
      </CardHeader>
      <CardContent>
        {menuItems.map((category, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold mb-2">{category.name}:</h3>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <Badge key={itemIndex} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MenuPreview;