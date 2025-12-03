
import React, { useState } from 'react';
import { SecurityLog } from '../types';
import { Shield, Smartphone, Globe, AlertTriangle, Check, Settings, X, Eye, FileCode } from 'lucide-react';

// Enhanced mock data with technical details separated from user friendly descriptions
const logs: SecurityLog[] = [
  { 
    id: 'L001', 
    timestamp: '2025-10-12 14:28:11', 
    user: '韦晓敏 (Admin)', 
    action: '用户登录', 
    module: '系统登录页', 
    ipAddress: '192.168.1.10', 
    status: 'Success', 
    description: '通过双重验证成功登录系统',
    technicalDetails: `{"event": "AUTH_LOGIN_SUCCESS", "method": "2FA", "provider": "local", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...", "session_id": "sess_89234j2"}`
  },
  { 
    id: 'L002', 
    timestamp: '2025-10-12 14:05:22', 
    user: '阳泽华', 
    action: '数据修改', 
    module: '数据采集页面', 
    ipAddress: '192.168.1.15', 
    status: 'Warning', 
    description: '修改了批号 20251012-A001 的生产数量',
    technicalDetails: `{"event": "DATA_UPDATE", "table": "production_batch", "record_id": "20251012-A001", "field": "quantity", "old_value": 1000, "new_value": 1200, "reason": "user_correction"}`
  },
  { 
    id: 'L003', 
    timestamp: '2025-10-12 13:55:00', 
    user: '系统自动', 
    action: '数据备份', 
    module: '后台服务', 
    ipAddress: 'localhost', 
    status: 'Success', 
    description: '完成每日全量数据库备份',
    technicalDetails: `{"event": "SYS_BACKUP_COMPLETED", "size": "4.2GB", "destination": "S3_Bucket_Backup", "duration": "124s", "integrity_check": "passed"}`
  },
  { 
    id: 'L004', 
    timestamp: '2025-10-12 11:20:45', 
    user: '未知访客', 
    action: '非法访问', 
    module: 'API网关', 
    ipAddress: '45.33.22.11', 
    status: 'Error', 
    description: '防火墙拦截了无效的签名请求',
    technicalDetails: `{"event": "SECURITY_BLOCK", "rule": "WAF_SIGNATURE_INVALID", "src_ip": "45.33.22.11", "target_endpoint": "/api/v1/admin/users", "payload_hash": "a1b2c3d4..."}`
  },
  { 
    id: 'L005', 
    timestamp: '2025-10-12 09:30:11', 
    user: '尤通', 
    action: '报表导出', 
    module: '报表中心', 
    ipAddress: '192.168.1.12', 
    status: 'Success', 
    description: '导出了第三季度生产质量报表',
    technicalDetails: `{"event": "REPORT_EXPORT", "type": "pdf", "report_id": "Q3_PROD_QUALITY", "file_size": "2.4MB", "download_time": "3.5s"}`
  },
];

const PolicyModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <Settings size={18} className="mr-2" />
            安全审计策略配置
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="space-y-4">
           <div>
             <h4 className="text-sm font-medium text-slate-700 mb-2">审计范围</h4>
             <div className="space-y-2">
               <label className="flex items-center space-x-2">
                 <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" defaultChecked />
                 <span className="text-sm text-slate-600">记录所有登录/登出行为</span>
               </label>
               <label className="flex items-center space-x-2">
                 <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" defaultChecked />
                 <span className="text-sm text-slate-600">记录敏感数据导出操作 (Export)</span>
               </label>
               <label className="flex items-center space-x-2">
                 <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" defaultChecked />
                 <span className="text-sm text-slate-600">记录关键参数修改 (Update/Delete)</span>
               </label>
             </div>
           </div>
           
           <div>
             <h4 className="text-sm font-medium text-slate-700 mb-2">风险预警阈值</h4>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-slate-500">连续登录失败锁定 (次)</label>
                  <input type="number" className="mt-1 w-full border rounded p-1.5 text-sm" defaultValue={5} />
               </div>
               <div>
                  <label className="block text-xs text-slate-500">异地IP访问告警</label>
                  <select className="mt-1 w-full border rounded p-1.5 text-sm bg-white">
                     <option>开启 (省外)</option>
                     <option>开启 (国除)</option>
                     <option>关闭</option>
                  </select>
               </div>
             </div>
           </div>
        </div>
        <div className="flex justify-end space-x-3 mt-8">
            <button onClick={onClose} className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-50">取消</button>
            <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700">
              保存策略
            </button>
        </div>
      </div>
    </div>
  );
};

const LogDetailModal = ({ isOpen, onClose, log }: { isOpen: boolean, onClose: () => void, log: SecurityLog | null }) => {
  if (!isOpen || !log) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden m-4">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-mono text-sm flex items-center">
            <FileCode size={16} className="mr-2 text-teal-400" />
            Log ID: {log.id} - Technical Details
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 bg-slate-50">
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
             <div><span className="text-slate-500">Time:</span> <span className="font-medium">{log.timestamp}</span></div>
             <div><span className="text-slate-500">IP:</span> <span className="font-medium font-mono">{log.ipAddress}</span></div>
             <div><span className="text-slate-500">Module:</span> <span className="font-medium">{log.module}</span></div>
             <div><span className="text-slate-500">User:</span> <span className="font-medium">{log.user}</span></div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono leading-relaxed">
              {JSON.stringify(JSON.parse(log.technicalDetails), null, 2)}
            </pre>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => { navigator.clipboard.writeText(log.technicalDetails); }}
              className="text-xs text-teal-600 hover:underline cursor-pointer"
            >
              复制 JSON 内容
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityLogs: React.FC = () => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  return (
    <div className="space-y-6">
       <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
       <LogDetailModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />

       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">安全日志审计</h1>
        <div className="flex space-x-2">
           <button className="text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-md hover:bg-teal-100 border border-teal-200">导出日志</button>
           <button 
             onClick={() => setIsPolicyOpen(true)}
             className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200 border border-slate-200"
           >
             配置策略
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">时间 / IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">用户 / 角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作模块 & 动作</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">技术详情</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'Success' && <Check className="text-green-500" size={18} />}
                    {log.status === 'Warning' && <AlertTriangle className="text-yellow-500" size={18} />}
                    {log.status === 'Error' && <Shield className="text-red-500" size={18} />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{log.timestamp}</div>
                    <div className="text-xs text-slate-500 font-mono flex items-center mt-1">
                      <Globe size={10} className="mr-1" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-slate-900">{log.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-slate-900 font-medium">{log.module}</div>
                     <div className="text-xs text-slate-500">{log.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="text-teal-600 hover:text-teal-800 flex items-center text-xs font-medium bg-teal-50 px-2 py-1 rounded border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      <Eye size={12} className="mr-1" />
                      查看代码
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
           <p className="text-xs text-slate-500 text-center">系统日志保留期限：180天。所有敏感操作均已安全存档。</p>
        </div>
      </div>
    </div>
  );
};
