import React, { useState, useEffect, useMemo } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList
} from 'recharts';
import { BrainCircuit, AlertOctagon, TrendingDown, Layers, Activity, Search, Filter } from 'lucide-react';

const riskData = [
  { subject: '原料质量', A: 90, fullMark: 100 },
  { subject: '生产温控', A: 85, fullMark: 100 },
  { subject: '仓储湿度', A: 60, fullMark: 100 },
  { subject: '物流时效', A: 95, fullMark: 100 },
  { subject: '合规性', A: 98, fullMark: 100 },
  { subject: '市场反馈', A: 75, fullMark: 100 },
];

const anomalyDataWarehouseA = [
  { time: '08:00', temp: 24, humidity: 45 },
  { time: '10:00', temp: 25, humidity: 46 },
  { time: '12:00', temp: 26, humidity: 48 },
  { time: '14:00', temp: 25, humidity: 45 },
  { time: '16:00', temp: 24, humidity: 44 },
];

const anomalyDataWarehouseB = [
  { time: '08:00', temp: 20, humidity: 60 },
  { time: '10:00', temp: 21, humidity: 62 },
  { time: '12:00', temp: 28, humidity: 75 }, // Anomaly
  { time: '14:00', temp: 25, humidity: 70 },
  { time: '16:00', temp: 22, humidity: 65 },
];

const anomalyDataWarehouseC = [
  { time: '08:00', temp: 4, humidity: 30 },
  { time: '10:00', temp: 5, humidity: 32 },
  { time: '12:00', temp: 5, humidity: 31 },
  { time: '14:00', temp: 6, humidity: 33 },
  { time: '16:00', temp: 5, humidity: 30 },
];

const initialDeepDiveData = [
  { id: 'R-001', target: '复方金银花颗粒 (Batch-20251012)', dim: '生产温控', score: 88, riskLevel: 'Low', status: 'Monitoring' },
  { id: 'R-002', target: '供应商: 广西药用植物园', dim: '原料杂质', score: 92, riskLevel: 'Low', status: 'Stable' },
  { id: 'R-003', target: '仓储B区 (阴凉库)', dim: '湿度控制', score: 65, riskLevel: 'High', status: 'Action Required' },
  { id: 'R-004', target: '物流车辆: 桂C-88888', dim: '运输震动', score: 95, riskLevel: 'Low', status: 'Completed' },
  { id: 'R-005', target: '板蓝根冲剂 (Batch-20241102)', dim: '效期临近', score: 40, riskLevel: 'Critical', status: 'Disposed' },
  { id: 'R-006', target: '感冒灵胶囊 (Batch-20250915)', dim: '成分波动', score: 82, riskLevel: 'Medium', status: 'Analysis' },
  { id: 'R-007', target: '阿莫西林胶囊 (Batch-20250812)', dim: '包材破损', score: 78, riskLevel: 'Medium', status: 'Investigating' },
  { id: 'R-008', target: '布洛芬缓释胶囊 (Batch-20251001)', dim: '生产异物', score: 98, riskLevel: 'Low', status: 'Stable' },
  { id: 'R-009', target: '供应商: 华北制药', dim: '供货延迟', score: 85, riskLevel: 'Low', status: 'Stable' },
  { id: 'R-010', target: '仓储C区 (冷库)', dim: '电力波动', score: 70, riskLevel: 'Medium', status: 'Maintenance' },
  { id: 'R-011', target: '物流车辆: 桂A-12345', dim: '冷链断链', score: 55, riskLevel: 'High', status: 'Alert' },
  { id: 'R-012', target: '维生素C片 (Batch-20250909)', dim: '氧化变色', score: 99, riskLevel: 'Low', status: 'Stable' },
];

export const RiskAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'drilldown'>('global');
  const [drillDimension, setDrillDimension] = useState('product');
  const [query, setQuery] = useState('');
  const [warehouse, setWarehouse] = useState('A');
  const [chartData, setChartData] = useState(anomalyDataWarehouseA);
  const [displayedDeepDiveData, setDisplayedDeepDiveData] = useState(initialDeepDiveData);

  // Update chart data when warehouse changes
  useEffect(() => {
    switch(warehouse) {
      case 'B': setChartData(anomalyDataWarehouseB); break;
      case 'C': setChartData(anomalyDataWarehouseC); break;
      default: setChartData(anomalyDataWarehouseA);
    }
  }, [warehouse]);

  const handleDeepDiveSearch = () => {
    if (!query) {
      setDisplayedDeepDiveData(initialDeepDiveData);
    } else {
      const filtered = initialDeepDiveData.filter(item => 
        item.target.toLowerCase().includes(query.toLowerCase()) ||
        item.dim.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedDeepDiveData(filtered);
    }
  };

  // Dynamic Summary Calculations
  const stats = useMemo(() => {
      if (displayedDeepDiveData.length === 0) return { avg: 0, source: 'None', trend: 'N/A' };
      
      const totalScore = displayedDeepDiveData.reduce((acc, curr) => acc + curr.score, 0);
      const avg = (totalScore / displayedDeepDiveData.length).toFixed(1);

      // Find primary risk source (most frequent dimension in High/Critical risks)
      const riskCounts: Record<string, number> = {};
      displayedDeepDiveData.forEach(item => {
          if (item.riskLevel === 'High' || item.riskLevel === 'Critical') {
              riskCounts[item.dim] = (riskCounts[item.dim] || 0) + 1;
          }
      });
      const source = Object.keys(riskCounts).length > 0 
          ? Object.keys(riskCounts).reduce((a, b) => riskCounts[a] > riskCounts[b] ? a : b)
          : '暂无高风险';

      const trend = Number(avg) > 85 ? '平稳' : Number(avg) > 70 ? '波动' : '恶化';

      return { avg, source, trend };
  }, [displayedDeepDiveData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI 智能风险分析</h1>
              <p className="text-indigo-100">基于大数据模型实时评估全链路质量风险</p>
            </div>
          </div>
          <div className="flex space-x-2 bg-black/20 p-1 rounded-lg">
             <button 
               onClick={() => setActiveTab('global')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'global' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:bg-white/10'}`}
             >
               全域管控 (Global)
             </button>
             <button 
               onClick={() => setActiveTab('drilldown')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'drilldown' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:bg-white/10'}`}
             >
               下钻分析 (Deep Dive)
             </button>
          </div>
        </div>
      </div>

      {activeTab === 'global' ? (
        /* Global Risk View */
        <div className="animate-fade-in space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-2">综合风险画像</h3>
               <p className="text-sm text-slate-500 mb-6">当前仓储湿度风险较高，建议检查B区除湿设备。</p>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} />
                     <Radar name="当前评分" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">环境异常检测 (Anomaly Detection)</h3>
                   <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 mt-2 rounded-full text-xs font-medium border border-red-100 w-fit">
                     <AlertOctagon size={14} className="mr-1" />
                     {warehouse === 'B' ? '检测到 B区 湿度剧烈波动' : '环境监测数据正常'}
                   </div>
                 </div>
                 <select 
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   <option value="A">仓库 A区 (常温)</option>
                   <option value="B">仓库 B区 (阴凉)</option>
                   <option value="C">仓库 C区 (冷链)</option>
                 </select>
               </div>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                     <Legend />
                     <Line type="monotone" dataKey="temp" name="温度 (°C)" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}>
                        <LabelList dataKey="temp" position="top" fill="#ef4444" fontSize={12} />
                     </Line>
                     <Line type="monotone" dataKey="humidity" name="湿度 (%)" stroke="#3b82f6" strokeWidth={2}>
                        <LabelList dataKey="humidity" position="top" fill="#3b82f6" fontSize={12} />
                     </Line>
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-900 mb-4">风险改进建议</h3>
             <div className="space-y-4">
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <TrendingDown className="text-teal-600 mt-1 mr-3" size={20} />
                   <div>
                      <h4 className="font-medium text-slate-900">优化仓储除湿策略</h4>
                      <p className="text-sm text-slate-500 mt-1">AI 预测未来 48 小时湿度将持续上升，建议提前开启备用除湿机组，预计可降低 15% 货损风险。</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Drill Down View */
        <div className="animate-fade-in space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Layers size={20} className="mr-2 text-indigo-600" />
                  多维风险下钻分析
                </h3>
                
                {/* Search & Filter Bar */}
                <div className="flex flex-1 md:justify-end gap-3">
                  <div className="relative flex">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="输入关键词 (批号/名称)" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-300 rounded-l-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                    />
                    <button 
                      onClick={handleDeepDiveSearch}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-r-md hover:bg-indigo-700 transition-colors"
                    >
                      查询
                    </button>
                  </div>
                  
                  <select 
                    className="rounded-md border-slate-300 border p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                    value={drillDimension}
                    onChange={(e) => setDrillDimension(e.target.value)}
                  >
                    <option value="product">按产品维度</option>
                    <option value="supplier">按供应商维度</option>
                    <option value="batch">按生产批次</option>
                    <option value="transport">按物流车次</option>
                    <option value="env">按环境区间</option>
                  </select>
                </div>
             </div>
             
             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 border rounded-lg hover:border-indigo-300 transition-colors bg-indigo-50/30">
                   <div className="text-sm text-slate-500 mb-1">平均风险评分</div>
                   <div className="text-2xl font-bold text-indigo-700">{stats.avg}</div>
                   <div className="text-xs text-green-600 mt-1">基于当前筛选结果</div>
                </div>
                <div className="p-4 border rounded-lg hover:border-indigo-300 transition-colors bg-white">
                   <div className="text-sm text-slate-500 mb-1">主要风险来源</div>
                   <div className="text-lg font-medium text-slate-800">{stats.source}</div>
                   <div className="text-xs text-slate-400 mt-1">需重点关注</div>
                </div>
                <div className="p-4 border rounded-lg hover:border-indigo-300 transition-colors bg-white">
                   <div className="text-sm text-slate-500 mb-1">AI 预测趋势</div>
                   <div className="text-lg font-medium text-slate-800 flex items-center">
                     <Activity size={16} className={`mr-1 ${stats.trend === '平稳' ? 'text-green-500' : 'text-yellow-500'}`} />
                     {stats.trend}
                   </div>
                   <div className="text-xs text-slate-400 mt-1">未来 72 小时</div>
                </div>
             </div>

             {/* Detailed Table */}
             <div className="overflow-x-auto border rounded-lg">
               <table className="min-w-full divide-y divide-slate-200">
                 <thead className="bg-slate-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">风险ID</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">评估对象 (Target)</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">风险维度</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">健康分</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">等级</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-slate-200">
                   {displayedDeepDiveData.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">{item.id}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.target}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.dim}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <div className="flex-1 w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                             <div className={`h-1.5 rounded-full ${item.score > 80 ? 'bg-green-500' : item.score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${item.score}%`}}></div>
                           </div>
                           <span className="text-xs font-medium">{item.score}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                            item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.riskLevel}
                          </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.status}</td>
                     </tr>
                   ))}
                   {displayedDeepDiveData.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          未找到匹配的风险记录
                        </td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};