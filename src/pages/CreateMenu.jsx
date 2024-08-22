import React from 'react';
import MenuGenerator from '../components/MenuGenerator';

const CreateMenu = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Create OLLAMA Menu</h1>
      <p className="text-gray-600 mb-8">Use this interface to create your custom OLLAMA mode menu with agents and selectable tools.</p>
      <MenuGenerator />
    </div>
  );
};

export default CreateMenu;