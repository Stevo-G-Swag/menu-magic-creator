import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateSelector from '../components/TemplateSelector';

const Templates = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = (template) => {
    // Navigate to the CreateMenu page with the selected template data
    navigate('/create', { state: { template } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Menu Templates</h1>
      <p className="text-gray-600 mb-8">Browse and select from our collection of pre-built OLLAMA menu templates. Click on a template to use it as a starting point for your custom menu.</p>
      <TemplateSelector onSelectTemplate={handleSelectTemplate} />
    </div>
  );
};

export default Templates;