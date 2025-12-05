import React, { useState } from 'react';
import { InventoryItem, InventoryCategory } from '../types';
import { Package, Plus, Minus, Filter, AlertCircle, ArrowUpDown, X, Search, Image as ImageIcon, ScanLine, Loader2 } from 'lucide-react';

// Enhanced Mock Data - Massive Expansion (30+ items)
const initialInventory: InventoryItem[] = [
  { id: '1', drugName: '复方金银花颗粒', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=JYH', category: '中成药', batchNumber: '20251012-A001', manufacturer: '姣恬制药', specification: '10g*10袋', quantity: 2450, unit: '盒', price: 28.5, expiryDate: '2026-10-12', inboundDate: '2025-10-12', status: 'Normal', location: 'A-01-02' },
  { id: '2', drugName: '感冒灵胶囊', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=GML', category: '中成药', batchNumber: '20250915-B022', manufacturer: '姣恬制药', specification: '0.5g*24粒', quantity: 120, unit: '盒', price: 15.0, expiryDate: '2026-09-15', inboundDate: '2025-09-20', status: 'LowStock', location: 'A-02-05' },
  { id: '3', drugName: '板蓝根冲剂', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=BLG', category: '中成药', batchNumber: '20241102-C103', manufacturer: '外部采购', specification: '15g*20袋', quantity: 0, unit: '包', price: 12.0, expiryDate: '2025-02-01', inboundDate: '2024-11-05', status: 'Expired', location: 'B-01-01' },
  { id: '4', drugName: '布洛芬缓释胶囊', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=BLF', category: '化学药', batchNumber: '20251001-D441', manufacturer: '姣恬制药', specification: '0.3g*10粒', quantity: 5000, unit: '盒', price: 32.0, expiryDate: '2027-10-01', inboundDate: '2025-10-05', status: 'Normal', location: 'A-03-01' },
  { id: '5', drugName: '阿莫西林胶囊', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=AMXL', category: '化学药', batchNumber: '20250812-E221', manufacturer: '华北制药', specification: '0.25g*24粒', quantity: 800, unit: '盒', price: 18.5, expiryDate: '2027-08-12', inboundDate: '2025-08-15', status: 'Normal', location: 'A-03-02' },
  { id: '6', drugName: '医用外科口罩', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=MASK', category: '医疗器械', batchNumber: '20251010-M001', manufacturer: '稳健医疗', specification: '10只/包', quantity: 10000, unit: '包', price: 5.0, expiryDate: '2027-10-10', inboundDate: '2025-10-11', status: 'Normal', location: 'C-01-01' },
  { id: '7', drugName: '丹参滴丸', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=DSDW', category: '中成药', batchNumber: '20250701-F112', manufacturer: '天士力', specification: '27mg*180丸', quantity: 50, unit: '瓶', price: 45.0, expiryDate: '2028-07-01', inboundDate: '2025-07-05', status: 'LowStock', location: 'B-02-01' },
  { id: '8', drugName: '维生素C片', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=VitC', category: '化学药', batchNumber: '20250909-V001', manufacturer: '汤臣倍健', specification: '100片/瓶', quantity: 2000, unit: '瓶', price: 99.0, expiryDate: '2027-09-09', inboundDate: '2025-09-10', status: 'Normal', location: 'A-04-01' },
  { id: '9', drugName: '黄芪切片', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=HQ', category: '中药饮片', batchNumber: '20251005-H001', manufacturer: '广西药材', specification: '500g/袋', quantity: 300, unit: '袋', price: 65.0, expiryDate: '2026-10-05', inboundDate: '2025-10-06', status: 'Normal', location: 'B-03-01' },
  { id: '10', drugName: '当归片', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=DG', category: '中药饮片', batchNumber: '20251005-D001', manufacturer: '广西药材', specification: '250g/袋', quantity: 450, unit: '袋', price: 48.0, expiryDate: '2026-10-05', inboundDate: '2025-10-06', status: 'Normal', location: 'B-03-02' },
  { id: '11', drugName: '电子体温计', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=THER', category: '医疗器械', batchNumber: '20250101-T001', manufacturer: '欧姆龙', specification: 'MC-246', quantity: 500, unit: '支', price: 39.0, expiryDate: '2030-01-01', inboundDate: '2025-01-15', status: 'Normal', location: 'C-02-01' },
  { id: '12', drugName: '连花清瘟胶囊', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=LHQW', category: '中成药', batchNumber: '20250615-L001', manufacturer: '以岭药业', specification: '0.35g*24粒', quantity: 1500, unit: '盒', price: 14.8, expiryDate: '2027-06-15', inboundDate: '2025-06-20', status: 'Normal', location: 'A-05-01' },
  { id: '13', drugName: '医用酒精 (75%)', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=ALC', category: '消毒用品', batchNumber: '20250920-J001', manufacturer: '蓝月亮', specification: '500ml/瓶', quantity: 200, unit: '瓶', price: 8.5, expiryDate: '2027-09-20', inboundDate: '2025-09-22', status: 'Normal', location: 'C-03-01' },
  { id: '14', drugName: 'PVC药用片材', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=PVC', category: '包装材料', batchNumber: '20250808-P002', manufacturer: '新材料科技', specification: '250mm*0.25mm', quantity: 5000, unit: 'kg', price: 12.0, expiryDate: '2028-08-08', inboundDate: '2025-08-10', status: 'Normal', location: 'D-01-01' },
  { id: '15', drugName: '淀粉 (药用级)', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=STARCH', category: '辅料', batchNumber: '20251001-F001', manufacturer: '河南淀粉厂', specification: '25kg/袋', quantity: 100, unit: '袋', price: 150.0, expiryDate: '2026-10-01', inboundDate: '2025-10-03', status: 'Normal', location: 'D-02-01' },
  { id: '16', drugName: '金银花提取物', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=EXT', category: '原料', batchNumber: '20251011-R001', manufacturer: '内部提取', specification: '10kg/桶', quantity: 50, unit: '桶', price: 2000.0, expiryDate: '2026-04-11', inboundDate: '2025-10-12', status: 'Normal', location: 'C-04-01' },
  { id: '17', drugName: '甘草片', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=GC', category: '中药饮片', batchNumber: '20250912-G005', manufacturer: '同仁堂', specification: '100g/瓶', quantity: 600, unit: '瓶', price: 18.0, expiryDate: '2026-09-12', inboundDate: '2025-09-15', status: 'Normal', location: 'B-04-02' },
  { id: '18', drugName: '头孢拉定胶囊', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=TFLD', category: '化学药', batchNumber: '20250720-T002', manufacturer: '国药集团', specification: '0.25g*24粒', quantity: 50, unit: '盒', price: 22.5, expiryDate: '2027-07-20', inboundDate: '2025-07-25', status: 'LowStock', location: 'A-06-01' },
  { id: '19', drugName: '碘伏消毒液', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=DF', category: '消毒用品', batchNumber: '20250830-I001', manufacturer: '安洁', specification: '100ml/瓶', quantity: 300, unit: '瓶', price: 5.5, expiryDate: '2027-08-30', inboundDate: '2025-09-01', status: 'Normal', location: 'C-03-02' },
  { id: '20', drugName: '铝箔 (PTP)', image: 'https://placehold.co/60x60/e2e8f0/64748b?text=ALU', category: '包装材料', batchNumber: '20250815-P003', manufacturer: '铝业股份', specification: '250mm', quantity: 2000, unit: 'kg', price: 25.0, expiryDate: '2030-08-15', inboundDate: '2025-08-20', status: 'Normal', location: 'D-01-02' },
  // Adding more items for "Massive Data" requirement
  { id: '21', drugName: '硝苯地平控释片', image: '', category: '化学药', batchNumber: '20250505-X009', manufacturer: '拜耳医药', specification: '30mg*7片', quantity: 1500, unit: '盒', price: 35.5, expiryDate: '2028-05-05', inboundDate: '2025-05-10', status: 'Normal', location: 'A-07-01' },
  { id: '22', drugName: '六味地黄丸', image: '', category: '中成药', batchNumber: '20250420-L008', manufacturer: '宛西制药', specification: '200丸/瓶', quantity: 800, unit: '瓶', price: 12.0, expiryDate: '2028-04-20', inboundDate: '2025-04-25', status: 'Normal', location: 'B-05-01' },
  { id: '23', drugName: '一次性使用输液器', image: '', category: '医疗器械', batchNumber: '20251010-S005', manufacturer: '威高集团', specification: '带针', quantity: 5000, unit: '支', price: 1.5, expiryDate: '2027-10-10', inboundDate: '2025-10-11', status: 'Normal', location: 'C-05-01' },
  { id: '24', drugName: '红霉素软膏', image: '', category: '化学药', batchNumber: '20250601-H002', manufacturer: '白云山', specification: '10g/支', quantity: 3000, unit: '支', price: 2.5, expiryDate: '2028-06-01', inboundDate: '2025-06-05', status: 'Normal', location: 'A-08-01' },
  { id: '25', drugName: '枸杞子', image: '', category: '中药饮片', batchNumber: '20250901-G003', manufacturer: '宁夏红', specification: '500g/袋', quantity: 150, unit: '袋', price: 45.0, expiryDate: '2026-09-01', inboundDate: '2025-09-05', status: 'LowStock', location: 'B-06-01' },
  { id: '26', drugName: '葡萄糖注射液', image: '', category: '化学药', batchNumber: '20251001-P005', manufacturer: '科伦药业', specification: '500ml', quantity: 1000, unit: '瓶', price: 4.0, expiryDate: '2027-10-01', inboundDate: '2025-10-05', status: 'Normal', location: 'A-09-01' },
  { id: '27', drugName: '医用棉签', image: '', category: '医疗器械', batchNumber: '20250815-M004', manufacturer: '稳健医疗', specification: '50支/包', quantity: 2000, unit: '包', price: 3.0, expiryDate: '2027-08-15', inboundDate: '2025-08-20', status: 'Normal', location: 'C-06-01' },
  { id: '28', drugName: '75%乙醇消毒液', image: '', category: '消毒用品', batchNumber: '20250910-Y002', manufacturer: '利康', specification: '500ml/瓶', quantity: 600, unit: '瓶', price: 7.5, expiryDate: '2027-09-10', inboundDate: '2025-09-15', status: 'Normal', location: 'C-03-03' },
  { id: '29', drugName: '藿香正气水', image: '', category: '中成药', batchNumber: '20250705-H006', manufacturer: '太极集团', specification: '10ml*10支', quantity: 1200, unit: '盒', price: 18.0, expiryDate: '2027-07-05', inboundDate: '2025-07-10', status: 'Normal', location: 'B-07-01' },
  { id: '30', drugName: '微晶纤维素', image: '', category: '辅料', batchNumber: '20250515-W001', manufacturer: '辅料科技', specification: '20kg/桶', quantity: 40, unit: '桶', price: 350.0, expiryDate: '2027-05-15', inboundDate: '2025-05-20', status: 'Normal', location: 'D-03-01' },
];

const StockModal = ({ isOpen, type, onClose, onSubmit, items }: any) => {
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && quantity) {
      setIsProcessing(true);
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 600));
      onSubmit(selectedId, parseInt(quantity));
      setIsProcessing(false);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedId('');
    setQuantity('');
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const filteredItems = items.filter((item: InventoryItem) => 
    item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: InventoryItem) => {
    setSelectedId(item.id);
    setSearchTerm(`${item.drugName} - ${item.batchNumber}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">{type === 'in' ? '产品入库登记' : '产品出库登记'}</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 flex justify-between">
              <span>选择产品批次</span>
              <span className="text-xs text-teal-600 flex items-center"><ScanLine size={12} className="mr-1"/> 扫码枪就绪</span>
            </label>
            <div className="relative mt-1">
              <input 
                type="text" 
                className="block w-full rounded-md border-slate-300 shadow-sm border p-2 pr-8"
                placeholder="输入名称或扫描条码..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedId('');
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <Search size={16} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
            </div>
            {isDropdownOpen && searchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item: InventoryItem) => (
                    <li 
                      key={item.id} 
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="font-medium text-slate-900">{item.drugName}</div>
                      <div className="text-xs text-slate-500">Batch: {item.batchNumber} | {item.specification}</div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-slate-400">无匹配结果</li>
                )}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">数量</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required 
              min="1"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-50">取消</button>
            <button 
                type="submit" 
                disabled={!selectedId || isProcessing} 
                className={`px-4 py-2 rounded-md text-white flex items-center ${type === 'in' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing && <Loader2 size={14} className="mr-2 animate-spin" />}
              确认{type === 'in' ? '入库' : '出库'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'All'>('All');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [modalState, setModalState] = useState<{open: boolean, type: 'in' | 'out'}>({ open: false, type: 'in' });

  const categories = ['All', '中药饮片', '中成药', '化学药', '医疗器械', '原料', '包装材料', '辅料', '消毒用品'];

  const handleStockUpdate = (id: string, qty: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = modalState.type === 'in' ? item.quantity + qty : Math.max(0, item.quantity - qty);
        let newStatus = item.status;
        if (newQty === 0) newStatus = 'Expired'; // simplified logic
        else if (newQty < 200) newStatus = 'LowStock';
        else newStatus = 'Normal';
        return { ...item, quantity: newQty, status: newStatus as any };
      }
      return item;
    }));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'LowStock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'Normal': return '正常';
      case 'LowStock': return '库存不足';
      case 'Expired': return '已过期/清空';
      default: return '未知';
    }
  };

  const filteredItems = items.filter(item => {
    const statusMatch = statusFilter === 'All' || item.status === statusFilter;
    const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      <StockModal 
        isOpen={modalState.open} 
        type={modalState.type} 
        onClose={() => setModalState({ ...modalState, open: false })}
        onSubmit={handleStockUpdate}
        items={items}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">库存管理</h1>
        <div className="flex gap-2">
          <button onClick={() => setModalState({ open: true, type: 'in' })} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
            <Plus size={16} className="mr-2" />
            入库登记
          </button>
          <button onClick={() => setModalState({ open: true, type: 'out' })} className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <Minus size={16} className="mr-2" />
            出库登记
          </button>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 overflow-x-auto">
           <div className="flex space-x-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        categoryFilter === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {cat === 'All' ? '全部分类' : cat}
                </button>
            ))}
           </div>
        </div>

        <div className="p-4 flex flex-wrap gap-4 items-center justify-between bg-slate-50 rounded-b-xl">
          <div className="flex gap-2 overflow-x-auto">
            {['All', 'Normal', 'LowStock', 'Expired'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                  statusFilter === f 
                    ? 'bg-teal-100 text-teal-800 border-teal-300' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f === 'All' ? '所有状态' : getStatusText(f)}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className={`flex items-center text-sm px-3 py-2 rounded-md transition-colors ${showAdvancedFilter ? 'text-teal-700 bg-teal-100' : 'text-slate-500 hover:bg-slate-200'}`}
          >
             <Filter size={16} className="mr-2" />
             高级筛选
          </button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilter && (
          <div className="border-t border-slate-200 p-4 bg-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="药品名称搜索" className="w-full rounded-md border-slate-300 border pl-9 p-2 text-sm" />
             </div>
             <input type="text" placeholder="生产批号" className="rounded-md border-slate-300 border p-2 text-sm" />
             <input type="text" placeholder="供应商" className="rounded-md border-slate-300 border p-2 text-sm" />
             <input type="date" className="rounded-md border-slate-300 border p-2 text-sm" />
             <select className="rounded-md border-slate-300 border p-2 text-sm bg-white">
                <option>所有仓库</option>
                <option>A区 (常温)</option>
                <option>B区 (阴凉)</option>
                <option>C区 (冷库)</option>
             </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">图片</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">药品信息</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分类 / 批号</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer hover:text-slate-700">
                    当前库存 <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">单价</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">库位</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="h-10 w-10 flex-shrink-0">
                        {item.image ? (
                            <img className="h-10 w-10 rounded-md object-cover border border-slate-200" src={item.image} alt="" />
                        ) : (
                            <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                <ImageIcon size={20} />
                            </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.drugName}</div>
                        <div className="text-xs text-slate-500">{item.specification} | {item.manufacturer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 font-medium">{item.category}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.batchNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${item.quantity < 200 ? 'text-red-600' : 'text-slate-900'}`}>
                      {item.quantity} 
                      <span className="text-slate-500 font-normal text-xs ml-1">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    ¥{item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-teal-600 hover:text-teal-900">详情</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
             <div>显示 {filteredItems.length} 条记录</div>
             <div className="flex space-x-2">
                 <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">上一页</button>
                 <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">下一页</button>
             </div>
        </div>
      </div>
      
      {/* Low Stock Alert Banner */}
      {items.some(i => i.status === 'LowStock') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                系统检测到库存预警：有 {items.filter(i => i.status === 'LowStock').length} 种药品库存低于安全阈值，请及时联系供应商补货。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};