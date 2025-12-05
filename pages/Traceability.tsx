import React, { useState } from 'react';
import { Search, CheckCircle, Clock, MapPin, Truck, Package, ChevronDown, AlertCircle } from 'lucide-react';
import { Stage } from '../types';

// Mock Database of Traceability Records - Synced with Inventory
const traceDatabase: Record<string, { name: string, manufacturer: string, expiry: string, status: string, timeline: any[] }> = {
  // 1. 复方金银花颗粒
  '20251012-A001': {
    name: '复方金银花颗粒 (10g x 10袋)',
    manufacturer: '姣恬制药',
    expiry: '2026-10-12',
    status: 'Qualified',
    timeline: [
      { stage: Stage.RawMaterial, date: '2025-10-01 09:30', location: '原材料仓库 A区', desc: '原料入库验收合格，供应商：广西药用植物园', status: 'Completed' },
      { stage: Stage.Production, date: '2025-10-03 14:15', location: '生产车间 #02', desc: '完成提取与浓缩工艺，温度控制：正常', status: 'Completed' },
      { stage: Stage.Storage, date: '2025-10-05 10:00', location: '成品库 B区', desc: '成品包装质检合格，入库待发', status: 'Completed' },
      { stage: Stage.Sales, date: '2025-10-08 16:20', location: '桂林市中心药房', desc: '药品已上架，环境监测正常', status: 'Pending' }
    ]
  },
  // 2. 感冒灵胶囊
  '20250915-B022': {
    name: '感冒灵胶囊 (0.5g x 24粒)',
    manufacturer: '姣恬制药',
    expiry: '2026-09-15',
    status: 'Qualified',
    timeline: [
      { stage: Stage.RawMaterial, date: '2025-09-01 08:30', location: '原材料仓库 A区', desc: '原料入库，检验合格', status: 'Completed' },
      { stage: Stage.Production, date: '2025-09-05 11:20', location: '生产车间 #01', desc: '胶囊充填完成，重量差异符合规定', status: 'Completed' },
      { stage: Stage.Storage, date: '2025-09-08 15:45', location: '成品库 A区', desc: '入库存储，温湿度达标', status: 'Completed' },
      { stage: Stage.Sales, date: '2025-09-20 09:10', location: '老百姓大药房', desc: '已售出', status: 'Completed' }
    ]
  },
  // 3. 板蓝根冲剂
  '20241102-C103': {
    name: '板蓝根冲剂 (15g x 20袋)',
    manufacturer: '外部采购',
    expiry: '2025-02-01',
    status: 'Risk',
    timeline: [
      { stage: Stage.RawMaterial, date: '2024-10-20 09:00', location: '供应商仓库', desc: '采购订单下达', status: 'Completed' },
      { stage: Stage.Production, date: '2024-10-25 10:00', location: '外包工厂', desc: '生产完成', status: 'Completed' },
      { stage: Stage.Storage, date: '2024-11-05 08:30', location: 'B区 阴凉库', desc: '入库质检：有效期临近预警', status: 'Completed' }
    ]
  },
  // 4. 布洛芬缓释胶囊
  '20251001-D441': {
    name: '布洛芬缓释胶囊 (0.3g x 10粒)',
    manufacturer: '姣恬制药',
    expiry: '2027-10-01',
    status: 'Qualified',
    timeline: [
      { stage: Stage.RawMaterial, date: '2025-09-20 10:00', location: '原料库 D区', desc: '原料接收，检验布洛芬含量99.8%', status: 'Completed' },
      { stage: Stage.Production, date: '2025-09-25 13:00', location: '生产车间 #03', desc: '缓释微丸包衣完成', status: 'Completed' },
      { stage: Stage.Storage, date: '2025-10-01 09:00', location: '成品库 C区', desc: '留样观察期结束，批准放行', status: 'Completed' }
    ]
  },
  // 5. 阿莫西林胶囊
  '20250812-E221': {
    name: '阿莫西林胶囊 (0.25g x 24粒)',
    manufacturer: '华北制药',
    expiry: '2027-08-12',
    status: 'Qualified',
    timeline: [
      { stage: Stage.RawMaterial, date: '2025-08-01', location: '外部供应商', desc: '原料采购', status: 'Completed' },
      { stage: Stage.Storage, date: '2025-08-15', location: 'A区 常温库', desc: '入库验收', status: 'Completed' }
    ]
  },
  // 6. 医用外科口罩
  '20251010-M001': {
    name: '医用外科口罩 (10只/包)',
    manufacturer: '稳健医疗',
    expiry: '2027-10-10',
    status: 'Qualified',
    timeline: [
      { stage: Stage.Storage, date: '2025-10-11', location: 'C区 医疗器械专区', desc: '入库上架', status: 'Completed' }
    ]
  },
  // 7. 丹参滴丸
  '20250701-F112': {
    name: '丹参滴丸 (27mg x 180丸)',
    manufacturer: '天士力',
    expiry: '2028-07-01',
    status: 'Qualified',
    timeline: [
       { stage: Stage.Storage, date: '2025-07-05', location: 'B区 阴凉库', desc: '库存低于安全阈值，请补货', status: 'Pending' }
    ]
  },
  // 8. 维生素C片
  '20250909-V001': {
    name: '维生素C片 (100片/瓶)',
    manufacturer: '汤臣倍健',
    expiry: '2027-09-09',
    status: 'Qualified',
    timeline: [
      { stage: Stage.RawMaterial, date: '2025-08-20', location: '原料库', desc: '维生素C粉末入库', status: 'Completed' },
      { stage: Stage.Production, date: '2025-09-01', location: '车间 #04', desc: '压片工艺完成', status: 'Completed' },
      { stage: Stage.Storage, date: '2025-09-10', location: 'A区 常温库', desc: '成品入库', status: 'Completed' }
    ]
  },
  // 13. 医用酒精
  '20250920-J001': {
    name: '医用酒精 (75% 500ml)',
    manufacturer: '蓝月亮',
    expiry: '2027-09-20',
    status: 'Qualified',
    timeline: [
       { stage: Stage.Storage, date: '2025-09-22', location: 'D区 危险品库', desc: '入库存储，防火检查通过', status: 'Completed' }
    ]
  },
  // 21. 硝苯地平
  '20250505-X009': {
     name: '硝苯地平控释片 (30mg*7片)',
     manufacturer: '拜耳医药',
     expiry: '2028-05-05',
     status: 'Qualified',
     timeline: [
        { stage: Stage.Storage, date: '2025-05-10', location: 'A区 常温库', desc: '入库', status: 'Completed' }
     ]
  },
  // 24. 红霉素软膏
  '20250601-H002': {
     name: '红霉素软膏 (10g/支)',
     manufacturer: '白云山',
     expiry: '2028-06-01',
     status: 'Qualified',
     timeline: [
        { stage: Stage.Storage, date: '2025-06-05', location: 'A区 常温库', desc: '入库', status: 'Completed' }
     ]
  }
};

// Predictive search suggestions
const suggestionsList = [
  '复方金银花颗粒',
  '感冒灵胶囊',
  '板蓝根冲剂',
  '布洛芬缓释胶囊',
  '阿莫西林胶囊',
  '丹参滴丸',
  '医用外科口罩',
  '维生素C片',
  '医用酒精',
  '20251012-A001',
  '20250915-B022',
  '20241102-C103',
  '20251001-D441'
];

export const Traceability: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('batch');
  const [result, setResult] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setNotFound(false);
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
    setSuggestions([]);
    
    // Simulate Search Logic
    // 1. Try direct batch match
    if (traceDatabase[query]) {
        setResult(traceDatabase[query]);
        setNotFound(false);
        return;
    }
    
    // 2. Try Name Match (Mock: return the first batch that matches name for demo)
    const matchedKey = Object.keys(traceDatabase).find(key => traceDatabase[key].name.includes(query));
    if (matchedKey) {
        setResult(traceDatabase[matchedKey]);
        setNotFound(false);
    } else {
        setResult(null);
        setNotFound(true);
    }
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

      {/* Not Found State */}
      {notFound && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">未找到相关记录</h3>
              <p className="text-slate-500 mt-2">请检查输入的批号或名称是否正确，或该批次数据尚未同步。</p>
          </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
            <div className="flex items-center space-x-4">
               <img src="https://placehold.co/100x100?text=Medicine" alt="Product" className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
               <div>
                  <h3 className="text-xl font-bold text-slate-900">{result.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">批号: {Object.keys(traceDatabase).find(key => traceDatabase[key] === result)} | 生产商: {result.manufacturer}</p>
                  <p className="text-sm text-slate-500">有效期至: {result.expiry}</p>
               </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${result.status === 'Qualified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {result.status === 'Qualified' ? <CheckCircle size={14} className="mr-1" /> : <AlertCircle size={14} className="mr-1" />}
              {result.status === 'Qualified' ? '质量合格' : '存在风险'}
            </span>
          </div>
          
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {result.timeline.map((event: any, eventIdx: number) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== result.timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            event.status === 'Completed' ? 'bg-teal-500' : 'bg-slate-200'
                          }`}>
                            {event.stage === Stage.RawMaterial && <Package size={16} className="text-white" />}
                            {event.stage === Stage.Production && <Clock size={16} className="text-white" />}
                            {event.stage === Stage.Storage && <Truck size={16} className="text-white" />}
                            {event.stage === Stage.Sales && <MapPin size={16} className="text-white" />}
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