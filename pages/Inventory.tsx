
import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryCategory } from '../types';
import { db } from '../db';
import { Package, Plus, Minus, Filter, AlertCircle, ArrowUpDown, X, Search, Image as ImageIcon, ScanLine, Loader2 } from 'lucide-react';

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
      await onSubmit(selectedId, parseInt(quantity));
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
              />
              <Search size={16} className="absolute right-2 top-2.5 text-slate-400" />
            </div>
            {isDropdownOpen && searchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {filteredItems.map((item: InventoryItem) => (
                  <li 
                    key={item.id} 
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSearchTerm(`${item.drugName} - ${item.batchNumber}`);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="font-medium text-slate-900">{item.drugName}</div>
                    <div className="text-xs text-slate-500">Batch: {item.batchNumber}</div>
                  </li>
                ))}
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
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-slate-600">取消</button>
            <button 
                type="submit" 
                disabled={!selectedId || isProcessing} 
                className={`px-4 py-2 rounded-md text-white flex items-center ${type === 'in' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
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
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalState, setModalState] = useState<{open: boolean, type: 'in' | 'out'}>({ open: false, type: 'in' });

  const loadData = async () => {
    setLoading(true);
    const data = await db.queryInventory({ category: categoryFilter, status: statusFilter });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, statusFilter]);

  const handleStockUpdate = async (id: string, qty: number) => {
    await db.updateStock(id, qty, modalState.type);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'LowStock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">库存管理系统</h1>
        <div className="flex gap-2">
          <button onClick={() => setModalState({ open: true, type: 'in' })} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors">
            <Plus size={16} className="mr-2" />
            入库登记
          </button>
          <button onClick={() => setModalState({ open: true, type: 'out' })} className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
            <Minus size={16} className="mr-2" />
            出库登记
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2">
          {['All', '中成药', '化学药', '医疗器械', '原料'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categoryFilter === cat ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              {cat === 'All' ? '全部' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 size={32} className="text-teal-600 animate-spin mb-2" />
                <span className="text-sm text-slate-500 font-medium">正在连接数据库...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">药品信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">批号 / 库位</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">当前库存</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{item.drugName}</div>
                      <div className="text-xs text-slate-500">{item.manufacturer} | {item.specification}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-slate-600">{item.batchNumber}</div>
                      <div className="text-xs text-slate-400">{item.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-bold ${item.quantity < 200 ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.quantity} <span className="text-slate-400 font-normal text-xs">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status === 'Normal' ? '正常' : item.status === 'LowStock' ? '库存低' : '已过期'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-teal-600 hover:text-teal-900 text-sm font-medium">详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
