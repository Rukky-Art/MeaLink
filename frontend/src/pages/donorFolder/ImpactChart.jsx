import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ImpactChart = ({ data }) => {
  return (
    <div className="h-70 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
              {/* Using a much lighter, softer mint for the gradient */}
              <stop offset="5%" stopColor="#D1FAE5" stopOpacity={0.6}/> 
              <stop offset="95%" stopColor="#D1FAE5" stopOpacity={0}/>
            </linearGradient>
          </defs>

          {/* Horizontal lines only, very faint */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />

          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 500 }}
            dy={15}
          />

          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#ffffff', fontSize: 12, opacity: 0.7 }}
            dx={-10}
          />

          <Tooltip 
            cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' 
            }}
            itemStyle={{ color: '#065f46', fontWeight: 'bold' }}
          />

          <Area 
            type="monotone" 
            dataKey="meals" 
            stroke="#ffffff" // Clean white line for maximum contrast
            fillOpacity={1} 
            fill="url(#colorImpact)" 
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#ffffff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;