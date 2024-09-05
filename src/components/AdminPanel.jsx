import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const [adminSettings, setAdminSettings] = useState({
    databaseUrl: '',
    serverPort: '',
    logLevel: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Fetch admin settings from the server
    const fetchAdminSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdminSettings(data);
        }
      } catch (error) {
        console.error('Error fetching admin settings:', error);
      }
    };
    fetchAdminSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(adminSettings),
      });
      if (response.ok) {
        toast({
          title: "Admin Settings Updated",
          description: "The admin settings have been successfully updated.",
        });
      } else {
        throw new Error('Failed to update admin settings');
      }
    } catch (error) {
      console.error('Error updating admin settings:', error);
      toast({
        title: "Error",
        description: "Failed to update admin settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="databaseUrl">Database URL</label>
            <Input
              id="databaseUrl"
              name="databaseUrl"
              type="text"
              value={adminSettings.databaseUrl}
              onChange={handleInputChange}
              placeholder="Enter the database URL"
            />
          </div>
          <div>
            <label htmlFor="serverPort">Server Port</label>
            <Input
              id="serverPort"
              name="serverPort"
              type="text"
              value={adminSettings.serverPort}
              onChange={handleInputChange}
              placeholder="Enter the server port"
            />
          </div>
          <div>
            <label htmlFor="logLevel">Log Level</label>
            <Input
              id="logLevel"
              name="logLevel"
              type="text"
              value={adminSettings.logLevel}
              onChange={handleInputChange}
              placeholder="Enter the log level"
            />
          </div>
          <Button type="submit">Save Admin Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;