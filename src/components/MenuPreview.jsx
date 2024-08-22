import React from 'react';

const MenuPreview = ({ title, agents, tools }) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">{title || 'Menu Title'}</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Agents:</h3>
        <ul className="list-disc list-inside">
          {agents.map((agent, index) => (
            <li key={index}>{agent.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Tools:</h3>
        <ul className="list-disc list-inside">
          {tools.map((tool, index) => (
            <li key={index}>{tool.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuPreview;