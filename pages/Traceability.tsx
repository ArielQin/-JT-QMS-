import React, { useState } from 'react';
import { Search, CheckCircle, Clock, MapPin, Truck, Package, ChevronDown } from 'lucide-react';
import { Stage } from '../types';

const timelineData = [
  {
    stage: Stage.RawMaterial,
    date: '2025-10-01 09:30',
    location: '原材料仓库 A区',
    desc: '原料入库验收合格，供应商：广西药用植物园',
    status: 'Completed'
  },
  {
    stage: Stage.Production,
    date: '2025-10-03 14:15',
    location: '生产车间 #02',
    desc: '完成提取与浓缩工艺，温度控制：正常',
    status: 'Completed'
  },
  {
    stage: Stage.Storage,
    date: '2025-10-05 10:00',
    location: '成品库 B区',
    desc: '成品包装质检合格，入库待发',
    status: 'Completed'
  },
  {
    stage: Stage.Sales,
    date: '2025-10-08 16:20',
    location: '桂林市中心药房',
    desc: '药品已上架，环境监测正常',
    status: 'Pending'
  }
];

// Predictive search suggestions
const suggestionsList = [
  '20251012-A001',
  '20250915-B022',
  '20241102-C103',
  '复方金银花颗粒',
  '感冒灵胶囊',
  '板蓝根冲剂',
  '布洛芬缓释胶囊'
];

export const Traceability: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('batch');
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filtered = suggestionsList.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (val: string) => {
    setQuery(val);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSuggestions([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">药品溯源查询</h1>
      
      {/* Search Bar */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center relative z-10">
        <h2 className="text-lg font-medium text-slate-700 mb-4">全链路数据追溯</h2>
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex shadow-sm rounded-lg overflow-visible border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 relative">
          <div className="relative z-20">
             <select 
               value={searchType}
               onChange={(e) => setSearchType(e.target.value)}
               className="h-full py-3 pl-4 pr-8 bg-slate-50 text-slate-700 text-sm font-medium border-r border-slate-300 focus:outline-none appearance-none cursor-pointer hover:bg-slate-100 rounded-l-lg"
             >
               <option value="batch">药品批号</option>
               <option value="name">药品名称</option>
             </select>
             <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex-1 relative z-20">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={searchType === 'batch' ? "例如: 20251012-A001" : "输入药品通用名"}
              className="w-full h-full px-4 py-3 text-slate-900 placeholder-slate-400 border-none focus:ring-0 rounded-none"
              autoComplete="off"
            />
            {/* Predictive Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 text-left">
                {suggestions.map((s, idx) => (
                  <li 
                    key={idx}
                    onClick={() => selectSuggestion(s)}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium flex items-center transition-colors z-20 rounded-r-lg"
          >
            <Search size={20} className="mr-2" />
            查询
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400">支持扫码枪录入(USB/蓝牙)或手动输入查询，数据实时同步</p>
      </div>

      {/* Results */}
      {searched && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
            <div className="flex items-center space-x-4">
               <img src="https://placehold.co/100x100?text=Medicine" alt="Product" className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
               <div>
                  <h3 className="text-xl font-bold text-slate-900">复方金银花颗粒 (10g x 10袋)</h3>
                  <p className="text-sm text-slate-500 mt-1">批号: 20251012-A001 | 生产商: 姣恬制药</p>
                  <p className="text-sm text-slate-500">有效期至: 2026-10-12</p>
               </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium flex items-center">
              <CheckCircle size={14} className="mr-1" /> 质量合格
            </span>
          </div>
          
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {timelineData.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== timelineData.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            event.status === 'Completed' ? 'bg-teal-500' : 'bg-slate-200'
                          }`}>
                            {eventIdx === 0 && <Package size={16} className="text-white" />}
                            {eventIdx === 1 && <Clock size={16} className="text-white" />}
                            {eventIdx === 2 && <Truck size={16} className="text-white" />}
                            {eventIdx === 3 && <MapPin size={16} className="text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{event.stage}</p>
                            <p className="text-sm text-slate-500 mt-1">{event.desc}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                    {event.location}
                                </span>
                            </div>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            <time dateTime={event.date}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};