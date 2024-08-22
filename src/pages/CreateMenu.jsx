import React, { useState } from 'react';
import MenuGenerator from '../components/MenuGenerator';
import MenuSpecificationForm from '../components/MenuSpecificationForm';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateMenu = () => {
  const [menuSpecification, setMenuSpecification] = useState(null);

  const handleSpecificationSubmit = (specification) => {
    setMenuSpecification(specification);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Create OLLAMA Menu</h1>
      <p className="text-gray-600 mb-8">Use this interface to create your custom OLLAMA mode menu with agents and selectable tools.</p>
      
      <Tabs defaultValue="specify">
        <TabsList>
          <TabsTrigger value="specify">Specify Menu</TabsTrigger>
          <TabsTrigger value="generate" disabled={!menuSpecification}>Generate Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="specify">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Menu Specification</h2>
            <MenuSpecificationForm onSubmit={handleSpecificationSubmit} />
          </Card>
        </TabsContent>
        <TabsContent value="generate">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Generate Menu</h2>
            {menuSpecification && (
              <MenuGenerator
                title={menuSpecification.title}
                agents={menuSpecification.agents.map(a => a.name).join(',')}
                tools={menuSpecification.tools.map(t => t.name).join(',')}
                customizations={JSON.stringify({
                  agents: menuSpecification.agents,
                  tools: menuSpecification.tools
                })}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateMenu;