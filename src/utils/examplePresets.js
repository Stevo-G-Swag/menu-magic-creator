export const examplePresets = {
  beginner: [
    {
      description: "Simple button with hover effect",
      code: `<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>`
    },
    {
      description: "Basic form input",
      code: `<input type="text" className="border rounded px-2 py-1" placeholder="Enter your name" />`
    }
  ],
  medium: [
    {
      description: "Responsive card component",
      code: `<div className="max-w-sm rounded overflow-hidden shadow-lg">
  <img className="w-full" src="/img/card-top.jpg" alt="Card image" />
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">Card Title</div>
    <p className="text-gray-700 text-base">
      Some quick example text to build on the card title and make up the bulk of the card's content.
    </p>
  </div>
</div>`
    },
    {
      description: "Toggle switch",
      code: `<label className="flex items-center cursor-pointer">
  <div className="relative">
    <input type="checkbox" className="sr-only" />
    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
    <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
  </div>
  <div className="ml-3 text-gray-700 font-medium">
    Toggle me
  </div>
</label>`
    }
  ],
  advanced: [
    {
      description: "Animated dropdown menu",
      code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Dropdown
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 1</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 2</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 3</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;`
    }
  ]
};