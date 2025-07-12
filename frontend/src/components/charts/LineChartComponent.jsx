import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ 
  data, 
  title, 
  dataKey = 'value', 
  xAxisDataKey = 'name',
  stroke = '#4f46e5',
  height = 300
}) => {
  return (
    <div className="card">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;