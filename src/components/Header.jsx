import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">AgentForge</Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link></li>
              <li><Link to="/create" className="text-gray-600 hover:text-gray-900">Create Menu</Link></li>
              <li><Link to="/templates" className="text-gray-600 hover:text-gray-900">Templates</Link></li>
              <li><Button variant="outline">Sign In</Button></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;