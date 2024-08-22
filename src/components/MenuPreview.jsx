import React from 'react';

const MenuPreview = ({ html }) => {
  return (
    <div className="border rounded-md p-4 h-[500px] overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default MenuPreview;