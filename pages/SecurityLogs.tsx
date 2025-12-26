
import React, { useState, useEffect } from 'react';
import { SecurityLog } from '../types';
import { db } from '../db';
import { Shield, Globe, AlertTriangle, Check, X, Eye, FileCode, Loader2, RefreshCw } from 'lucide-react';

export const SecurityLogs: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await db.queryLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-mono text-sm flex items-center">
                <FileCode size={16} className="mr-2 text-teal-400" />
                Event Detail: {selectedLog.id}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 bg-slate-50">
               <div className="mb-4 text-sm text-slate-600">
                  <p><b>操作人:</b> {selectedLog.user}</p>
                  <p><b>描述:</b> {selectedLog.description}</p>
               </div>
               <div className="bg-slate-900 rounded-lg p-4 max-h-[400px] overflow-auto">
                 <pre className="text-xs text-green-400 font-mono">
                   {JSON.stringify(JSON.parse(selectedLog.technicalDetails || '{}'), null, 2)}
                 </pre>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">系统审计日志</h1>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10">
            <Loader2 size={32} className="text-teal-600 animate-spin mb-2" />
            <span className="text-sm text-slate-500">正在查询审计数据库...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">时间 / IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作动作</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">技术详情</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {log.status === 'Success' ? <Check className="text-green-500" size={18} /> : <AlertTriangle className="text-red-500" size={18} />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-900 font-medium">{log.timestamp}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.ipAddress}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{log.user}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-900">{log.action}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{log.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="text-xs text-teal-600 hover:bg-teal-50 px-2 py-1 rounded border border-teal-100"
                      >
                        <Eye size={12} className="inline mr-1" />
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
