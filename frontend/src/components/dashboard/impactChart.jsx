import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', meals: 40 },
  { name: 'Tue', meals: 30 },
  { name: 'Wed', meals: 65 },
  { name: 'Thu', meals: 45 },
  { name: 'Fri', meals: 90 },
  { name: 'Sat', meals: 75 },
  { name: 'Sun', meals: 55 },
];

const ImpactChart = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00A859" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#00A859" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
        <YAxis hide />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="meals" 
          stroke="#00A859" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorMeals)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default ImpactChart;