import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '',
  titleClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 ${titleClassName}`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;