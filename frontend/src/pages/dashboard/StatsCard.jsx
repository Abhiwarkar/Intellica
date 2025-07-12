import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

const StatsCard = ({ title, value, change, icon, color = 'blue' }) => {
  const isPositive = change > 0;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  
  const backgroundColorClass = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${backgroundColorClass}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <div className="flex items-center">
            {change !== 0 && (
              <>
                {isPositive ? (
                  <ArrowUpIcon className="flex-shrink-0 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="flex-shrink-0 h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-1 font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Math.abs(change)}%
                </span>
              </>
            )}
            <span className="ml-2 text-gray-500">from previous period</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;