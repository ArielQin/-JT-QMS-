
import React, { useState } from 'react';
import { Stage, InputMode } from '../types';
import { Camera, Scan, Save, RefreshCw, Settings, Wifi, QrCode, Database, Clock } from 'lucide-react';

const historyData = [
  { id: '1', time: '14:30', stage: '产品采购', batch: '20251012-A001', operator: '韦晓敏', status: 'Success' },
  { id: '2', time: '14:15', stage: '生产加工', batch: '20251012-P005', operator: '阳泽华', status: 'Success' },
  { id: '3', time: '11:20', stage: '仓储物流', batch: '20251011-W002', operator: '系统自动', status: 'Pending' },
  { id: '4', time: '09:45', stage: '销售终端', batch: '20251010-S099', operator: '王药师', status: 'Success' },
  { id: '5', time: '09:30', stage: '产品采购', batch: '20251012-A002', operator: '韦晓敏', status: 'Warning' },
];

export const DataEntry: React.FC = () => {
  const [activeStage, setActiveStage] = useState<Stage>(Stage.RawMaterial);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.Manual);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderScannerInterface = () => (
    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Scan size={32} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">扫码枪接口配置与管理</h3>
      <p className="text-sm text-slate-500 mb-6">配置并管理连接到本机的工业扫码设备、PDA 或 RFID 读写器</p>
      
      <div className="max-w-xl mx-auto space-y-3">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-teal-500 transition-colors bg-slate-50">
           <div className="flex items-center">
             <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
             <div className="text-left">
               <div className="font-medium text-slate-900">Honeywell 1900G (USB)</div>
               <div className="text-xs text-slate-500">Port: COM3 | Baud: 9600 | Mode: Continuous</div>
             </div>
           </div>
           <div className="flex space-x-2">
            <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded text-slate-600">测试</button>
            <button className="text-xs bg-teal-50 border border-teal-200 px-3 py-1 rounded text-teal-700">配置</button>
           </div>
        </div>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 opacity-60">
           <div className="flex items-center">
             <div className="w-2 h-2 rounded-full bg-slate-400 mr-3"></div>
             <div className="text-left">
               <div className="font-medium text-slate-900">Zebra DS2208 (Bluetooth)</div>
               <div className="text-xs text-slate-500">Status: Disconnected | MAC: 00:11:22:33:44:55</div>
             </div>
           </div>
           <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded text-slate-600">连接</button>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center space-x-4">
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700">
           <RefreshCw size={14} className="mr-2" /> 刷新设备列表
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm hover:bg-slate-50">
           <Settings size={14} className="mr-2" /> 驱动设置
        </button>
      </div>
    </div>
  );

  const renderMobileInterface = () => (
    <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col items-center animate-fade-in">
       <div className="p-4 bg-white border-2 border-slate-900 rounded-xl mb-6 shadow-lg">
         <QrCode size={160} className="text-slate-900" />
       </div>
       <h3 className="text-lg font-bold text-slate-900 mb-2">移动端数据同步管理</h3>
       <p className="text-sm text-slate-500 text-center max-w-md mb-6">
         请使用 <b>姣恬科技企业版 APP</b> 扫描上方二维码，进行权限验证后，即可实时同步手持终端采集的 OCR 图片、表单数据至中央数据库。
       </p>
       <div className="flex space-x-8 text-sm text-slate-400">
         <div className="flex items-center"><Wifi size={16} className="mr-1" /> 5G/WiFi6 专网</div>
         <div className="flex items-center"><Database size={16} className="mr-1" /> 实时加密同步</div>
       </div>
       
       <div className="mt-8 w-full max-w-md">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">已连接设备 (2)</div>
          <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
             <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-slate-700">iPad Pro (Warehouse A)</span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">在线</span>
             </div>
             <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-slate-700">Android PDA (Line 3)</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">离线 (15m ago)</span>
             </div>
          </div>
       </div>
    </div>
  );

  const renderManualForm = () => {
    switch (activeStage) {
      case Stage.RawMaterial:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800">产品与供应商信息</div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产品类型</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border p-2.5 bg-white">
                <option>成品 (Finished Product)</option>
                <option>半成品 (Semi-finished)</option>
                <option>原料 (Raw Material)</option>
                <option>包装材料 (Packaging)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产品/原料名称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="如: 金银花 / 复方金银花颗粒" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">供应商全称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="供应商标准全称" />
            </div>

            <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800 mt-4">质检与合规</div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">供应商批号 (Supplier Batch)</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">采购数量 & 单位</label>
              <div className="flex gap-2">
                <input type="number" className="mt-1 block w-2/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="0.00" />
                <select className="mt-1 block w-1/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border bg-white p-2">
                  <option>kg</option>
                  <option>g</option>
                  <option>mg</option>
                  <option>吨</option>
                  <option>L</option>
                  <option>ml</option>
                  <option>包</option>
                  <option>件</option>
                  <option>盒</option>
                  <option>瓶</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产地 / 来源地</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="省/市/县/基地" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">GMP 证书编号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">质检报告单号 (COA)</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
          </div>
        );
      case Stage.Production:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800">生产排程与对象</div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">加工产品名称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="正在生产的产品名称" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">生产任务单号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">成品批号 (Product Batch)</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">生产线 / 机台</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border p-2.5 bg-white">
                <option>Line A-01 (提取)</option>
                <option>Line A-02 (浓缩)</option>
                <option>Line B-01 (制剂)</option>
                <option>Line C-01 (包装)</option>
                <option>Line D-05 (无菌灌装)</option>
              </select>
            </div>

            <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800 mt-4">关键工艺参数 (CCP)</div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">计划产量 & 单位</label>
              <div className="flex gap-2">
                <input type="number" className="mt-1 block w-2/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="0.00" />
                <select className="mt-1 block w-1/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border bg-white p-2">
                  <option>盒</option>
                  <option>瓶</option>
                  <option>袋</option>
                  <option>件</option>
                  <option>kg</option>
                  <option>L</option>
                  <option>ml</option>
                  <option>g</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">灭菌温度 (°C)</label>
              <input type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="121.0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">灭菌时间 (min)</label>
              <input type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
          </div>
        );
      case Stage.Storage:
         return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800">入库/出库对象</div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产品/货物名称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="入库或出库的产品" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产品批号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">入库/出库单号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            
            <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800 mt-4">位置与物流信息</div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">仓库区域</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border p-2.5 bg-white">
                <option>A区 (常温库)</option>
                <option>B区 (阴凉库)</option>
                <option>C区 (冷库)</option>
                <option>D区 (危险品库)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">货位编号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="例如: A-01-02-05" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">操作数量 & 单位</label>
               <div className="flex gap-2">
                <input type="number" className="mt-1 block w-2/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="0.00" />
                <select className="mt-1 block w-1/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border bg-white p-2">
                   <option>件</option>
                  <option>盒</option>
                  <option>瓶</option>
                  <option>袋</option>
                  <option>kg</option>
                  <option>L</option>
                  <option>吨</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">物流承运商</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="如: 顺丰冷运" />
            </div>
          </div>
         );
      case Stage.Sales:
         return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800">销售明细</div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">销售产品名称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">产品批号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">销售出库单号</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            
            <div className="md:col-span-3 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800 mt-4">终端去向</div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">销售终端 / 药房名称</label>
              <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">销售日期</label>
              <input type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">销售数量</label>
               <div className="flex gap-2">
                <input type="number" className="mt-1 block w-2/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" placeholder="0.00" />
                <select className="mt-1 block w-1/3 rounded-md border-slate-300 shadow-sm focus:border-teal-500 sm:text-sm border bg-white p-2">
                  <option>盒</option>
                  <option>瓶</option>
                  <option>袋</option>
                  <option>支</option>
                </select>
              </div>
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">单价 (CNY)</label>
              <input type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2.5" />
            </div>
          </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">数据采集与录入</h1>
        <div className="flex bg-slate-200 rounded-lg p-1">
          <button
            onClick={() => setInputMode(InputMode.Manual)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${inputMode === InputMode.Manual ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'}`}
          >
            数据录入
          </button>
          <button
            onClick={() => setInputMode(InputMode.Scanner)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${inputMode === InputMode.Scanner ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'}`}
          >
            扫码枪管理
          </button>
          <button
            onClick={() => setInputMode(InputMode.Mobile)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${inputMode === InputMode.Mobile ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'}`}
          >
            移动端管理
          </button>
        </div>
      </div>

      {inputMode === InputMode.Scanner ? (
        renderScannerInterface()
      ) : inputMode === InputMode.Mobile ? (
        renderMobileInterface()
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Stage Tabs */}
            <div className="border-b border-slate-200 bg-slate-50 overflow-x-auto">
              <div className="flex">
                {Object.values(Stage).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setActiveStage(stage)}
                    className={`flex-1 py-4 px-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeStage === stage
                        ? 'border-teal-500 text-teal-600 bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Dynamic Form Fields */}
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                   <span className="w-1.5 h-6 bg-teal-500 mr-3 rounded-full"></span>
                   {activeStage} 详细数据录入
                 </h3>
                 {renderManualForm()}
              </div>

              {/* Image Upload Section */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">现场凭证上传</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-teal-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <div className="flex justify-center text-slate-400">
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="h-32 object-contain" />
                        ) : (
                          <Camera size={48} strokeWidth={1} />
                        )}
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                          <span>上传图片</span>
                          <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">或拖拽至此处</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                       <div className="flex">
                         <div className="flex-shrink-0">
                           <Database className="h-5 w-5 text-slate-400" />
                         </div>
                         <div className="ml-3">
                           <h3 className="text-sm font-medium text-slate-800">数据库同步状态</h3>
                           <div className="mt-2 text-sm text-slate-600">
                             <p>数据将在提交后自动加密存储并分发至各业务节点。</p>
                             <p className="mt-1 font-mono text-xs text-green-600">Connection: Secure (SSL/TLS 1.3)</p>
                           </div>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-6">
                <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                  <RefreshCw size={16} className="mr-2" />
                  重置
                </button>
                <button className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  <Save size={16} className="mr-2" />
                  提交数据
                </button>
              </div>
            </div>
          </div>
          
          {/* Recent History Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <Clock size={16} className="mr-2 text-slate-500" />
                  今日录入明细
                </h3>
                <span className="text-xs text-slate-500">共 5 条记录</span>
             </div>
             <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">时间</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">环节</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">批号/单号</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作人</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-slate-200">
                 {historyData.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50">
                     <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{item.time}</td>
                     <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600">{item.stage}</td>
                     <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-slate-600">{item.batch}</td>
                     <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{item.operator}</td>
                     <td className="px-6 py-3 whitespace-nowrap">
                       <span className={`px-2 py-0.5 text-xs rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-700' : item.status === 'Warning' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {item.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};
