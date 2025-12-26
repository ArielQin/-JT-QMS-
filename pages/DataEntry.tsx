
import React, { useState } from 'react';
import { Stage, InputMode } from '../types';
import { db } from '../db';
import { useAuth } from '../AuthContext';
import { Camera, Scan, Save, RefreshCw, Database, Check, Loader2 } from 'lucide-react';

export const DataEntry: React.FC = () => {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState<Stage>(Stage.RawMaterial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    drugName: '',
    batchNumber: '',
    category: '中成药',
    manufacturer: '姣恬制药',
    specification: '10g*10袋',
    quantity: '',
    unit: '盒',
    price: 0,
    expiryDate: '2026-10-12',
    location: 'A-01-01'
  });

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.drugName || !formData.batchNumber) {
      alert('请填写必要的产品名称和批号');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.insertInventory({
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        inboundDate: new Date().toISOString().split('T')[0],
        status: 'Normal'
      });
      
      setToast('数据采集成功，已持久化至中央数据库！');
      setTimeout(() => setToast(null), 3000);
      
      // 重置表单
      setFormData({
        drugName: '',
        batchNumber: '',
        category: '中成药',
        manufacturer: '姣恬制药',
        specification: '',
        quantity: '',
        unit: '盒',
        price: 0,
        expiryDate: '2026-12-31',
        location: 'A-01-01'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center animate-fade-in">
          <Check size={20} className="mr-2" />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">生产数据采集中心</h1>
        <div className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 font-medium">
          数据库连接: 建立 (Secure Storage)
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                   <Database size={18} className="mr-2 text-teal-600" />
                   采集产品基础信息
                 </h3>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">药品/原料名称</label>
                <input 
                  type="text" 
                  value={formData.drugName}
                  onChange={e => handleInputChange('drugName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  placeholder="如: 连花清瘟"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">生产批号 (Batch Number)</label>
                <input 
                  type="text" 
                  value={formData.batchNumber}
                  onChange={e => handleInputChange('batchNumber', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono" 
                  placeholder="2025XXXX-XXXX"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">产品分类</label>
                <select 
                  value={formData.category}
                  onChange={e => handleInputChange('category', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option>中成药</option>
                  <option>化学药</option>
                  <option>医疗器械</option>
                  <option>原料</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">采集数量</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={e => handleInputChange('quantity', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2.5" 
                    placeholder="0"
                  />
                  <select 
                    value={formData.unit}
                    onChange={e => handleInputChange('unit', e.target.value)}
                    className="w-24 border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    <option>盒</option>
                    <option>瓶</option>
                    <option>kg</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">库位分配</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5" 
                  placeholder="如: A-01-05"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">有效期</label>
                <input 
                  type="date" 
                  value={formData.expiryDate}
                  onChange={e => handleInputChange('expiryDate', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5" 
                />
              </div>
           </div>

           <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setFormData({ drugName: '', batchNumber: '', quantity: '' })}
                className="px-6 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
              >
                <RefreshCw size={18} className="mr-2" />
                清空重置
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-2 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                {isSubmitting ? '正在写入数据库...' : '保存至系统'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
