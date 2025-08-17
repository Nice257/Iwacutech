import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', shadow = 'shadow-md' }) => {
  return (
    <div className={`bg-white rounded-lg ${shadow} border border-gray-200 ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;