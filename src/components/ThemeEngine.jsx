import React, { useState } from 'react';
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const prebuiltThemes = [
  { name: 'Default', value: 'default' },
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
  { name: 'Colorful', value: 'colorful' },
];

const ThemeEngine = ({ onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customStyles, setCustomStyles] = useState('');

  const handleThemeChange = (value) => {
    setSelectedTheme(value);
    onThemeChange({ theme: value, customStyles });
  };

  const handleCustomStylesChange = (e) => {
    setCustomStyles(e.target.value);
    onThemeChange({ theme: selectedTheme, customStyles: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="theme-select">Select Theme</Label>
        <Select onValueChange={handleThemeChange} value={selectedTheme}>
          <Select.Trigger id="theme-select">
            <Select.Value placeholder="Select a theme" />
          </Select.Trigger>
          <Select.Content>
            {prebuiltThemes.map((theme) => (
              <Select.Item key={theme.value} value={theme.value}>
                {theme.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div>
        <Label htmlFor="custom-styles">Custom CSS Styles</Label>
        <Textarea
          id="custom-styles"
          placeholder="Enter custom CSS styles here"
          value={customStyles}
          onChange={handleCustomStylesChange}
          rows={5}
        />
      </div>
    </div>
  );
};

export default ThemeEngine;