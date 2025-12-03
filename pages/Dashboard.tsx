import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, LabelList, Cell
} from 'recharts';
import { Activity, PackageCheck, AlertTriangle, TrendingUp, Calendar, X, ChevronDown } from 'lucide-react';

// Mock Data Generators
const generateTrendData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      name: `${d.getMonth() + 1}-${d.getDate()}`,
      value: Math.floor(Math.random() * 2000) + 2000 + (Math.random() * 1000), // Random value between 2000-5000
    });
  }
  return data;
};

const initialInventoryData = [
  { name: '复方金银花', stock: 2450, expiryRate: 1.2 }, 
  { name: '感冒灵', stock: 3200, expiryRate: 0.5 },
  { name: '板蓝根', stock: 1500, expiryRate: 4.5 },
  { name: '布洛芬', stock: 5000, expiryRate: 0.2 },
  { name: '阿莫西林', stock: 1200, expiryRate: 0.8 },
  { name: '维生素C', stock: 6000, expiryRate: 0.1 },
  { name: '丹参滴丸', stock: 800, expiryRate: 2.1 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between cursor-pointer hover:shadow-md transition-shadow group"
  >
    <div>
      <p className="text-sm font-medium text-slate-500 group-hover:text-teal-600 transition-colors">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      <p className={`text-xs mt-1 font-medium ${subtext.includes('+') ? 'text-green-600' : subtext.includes('异常') ? 'text-red-500' : 'text-slate-400'}`}>
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color} group-hover:opacity-80 transition-opacity`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const DetailModal = ({ isOpen, onClose, title }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl m-4 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">{title} - 数据明细</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">项目/批次</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">数值</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">趋势</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">责任人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {Array.from({ length: 12 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-medium">Batch-202510-{100 + i}</div>
                          <div className="text-xs text-slate-500">生产线 #{i % 4 + 1}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                    {Math.floor(Math.random() * 5000) + 500}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                     {Math.random() > 0.5 ? (
                       <span className="text-green-600 flex items-center">
                         <TrendingUp size={12} className="mr-1" /> +{(Math.random() * 5).toFixed(2)}%
                       </span>
                     ) : (
                       <span className="text-slate-400">--</span>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {['韦晓敏', '阳泽华', '尤通', '系统自动'][i % 4]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 cursor-pointer hover:underline">查看详情</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [detailModal, setDetailModal] = useState<{open: boolean, title: string}>({ open: false, title: '' });
  const [dateRangeOption, setDateRangeOption] = useState('7days');
  const [chartData, setChartData] = useState(generateTrendData(6)); // Default 7 days (0-6)

  const openModal = (title: string) => setDetailModal({ open: true, title });

  // Update chart data when date range changes
  useEffect(() => {
    let days = 6;
    if (dateRangeOption === '30days') days = 29;
    if (dateRangeOption === 'quarter') days = 89;
    
    setChartData(generateTrendData(days));
  }, [dateRangeOption]);

  const getDateLabel = () => {
    switch(dateRangeOption) {
      case '30days': return '近 30 天';
      case 'quarter': return '本季度';
      default: return '近 7 天';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <DetailModal 
        isOpen={detailModal.open} 
        title={detailModal.title} 
        onClose={() => setDetailModal({ ...detailModal, open: false })} 
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">系统概览</h1>
          <p className="text-sm text-slate-500">姣恬科技内部质量管理系统 Dashboard</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          数据库连接状态: 正常 | 延迟: 12ms
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="今日生产批次" 
          value="24" 
          subtext="+12% 较昨日" 
          icon={Activity} 
          color="bg-blue-500" 
          onClick={() => openModal('生产批次统计')}
        />
        <StatCard 
          title="库存周转率" 
          value="98.5%" 
          subtext="运转高效" 
          icon={TrendingUp} 
          color="bg-teal-500" 
          onClick={() => openModal('库存周转明细')}
        />
        <StatCard 
          title="待检产品" 
          value="156" 
          subtext="需优先处理" 
          icon={PackageCheck} 
          color="bg-orange-500" 
          onClick={() => openModal('质检任务列表')}
        />
        <StatCard 
          title="风险预警" 
          value="2" 
          subtext="环境温度异常" 
          icon={AlertTriangle} 
          color="bg-red-500" 
          onClick={() => openModal('风险预警日志')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">生产趋势分析</h3>
            <div className="relative">
              <select 
                value={dateRangeOption}
                onChange={(e) => setDateRangeOption(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-md py-1 pl-3 pr-8 text-xs text-slate-700 cursor-pointer hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="7days">近 7 天</option>
                <option value="30days">近 30 天</option>
                <option value="quarter">本季度</option>
              </select>
              <Calendar size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0f766e" fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory & Expiry */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">库存量与临期率 (3个月内)</h3>
          <p className="text-xs text-slate-500 mb-4">展示主要产品的实时库存及临期产品占比</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialInventoryData} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="stock" name="当前库存(盒)" fill="#cbd5e1" barSize={20} radius={[0, 4, 4, 0]}>
                   <LabelList dataKey="stock" position="right" fontSize={10} fill="#64748b" />
                </Bar>
                <Bar dataKey="expiryRate" name="临期率(%)" fill="#f43f5e" barSize={20} radius={[0, 4, 4, 0]}>
                   <LabelList dataKey="expiryRate" position="right" formatter={(val: number) => `${val}%`} fontSize={10} fill="#f43f5e" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};