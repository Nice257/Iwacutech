import React from 'react';
import { getPasswordStrength } from '../../utils/validation';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const { score, level, color, feedback } = strength;

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-500 text-red-700',
      orange: 'bg-orange-500 text-orange-700',
      yellow: 'bg-yellow-500 text-yellow-700',
      blue: 'bg-blue-500 text-blue-700',
      green: 'bg-green-500 text-green-700'
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i < score ? getColorClasses(color).split(' ')[0] : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
      
      {/* Strength text */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${getColorClasses(color).split(' ')[1]}`}>
          {level}
        </span>
        <span className="text-xs text-gray-500">
          {score}/5
        </span>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="text-xs text-gray-500">
          <p>Missing: {feedback.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;