import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Lock, User, ArrowRight, ShieldCheck, Activity, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('用户名或密码错误 (默认密码: 123)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Side - Brand / Image */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">JT</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">姣恬科技</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">内部质量管理系统</h2>
            <p className="text-slate-400 leading-relaxed">
              全链路溯源 · AI 风险管控 · GxP 合规审计 <br/>
              保障每一粒药品的安全与质量。
            </p>
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center text-sm text-slate-300">
                <ShieldCheck className="mr-3 text-teal-400" size={20} />
                <span>企业级安全加密传输</span>
             </div>
             <div className="flex items-center text-sm text-slate-300">
                <Activity className="mr-3 text-teal-400" size={20} />
                <span>实时生产数据监控</span>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">账号登录</h3>
            <p className="text-slate-500 text-sm mt-2">请输入您的员工工号或系统账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">账号 / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                  placeholder="请输入账号"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密码 / Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg animate-fade-in">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  登录系统 <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="fixed bottom-4 text-slate-400 text-xs text-center w-full">
        © 2025 桂林市姣恬医药科技有限公司 | 系统版本 v2.1.0
      </div>
    </div>
  );
};