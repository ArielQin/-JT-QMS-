import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  FileInput, 
  Search, 
  Package, 
  ShieldAlert, 
  ShieldCheck, 
  Menu,
  X,
  LogOut,
  Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "系统概览" },
    { to: "/data-entry", icon: <FileInput size={20} />, label: "数据采集" },
    { to: "/traceability", icon: <Search size={20} />, label: "溯源查询" },
    { to: "/inventory", icon: <Package size={20} />, label: "库存管理" },
    { to: "/risk-analysis", icon: <ShieldAlert size={20} />, label: "AI 风险分析" },
    { to: "/security-logs", icon: <ShieldCheck size={20} />, label: "安全日志" },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const handleSwitchAccount = () => {
    setShowUserMenu(false);
    logout(); // In a simple system, switching account is essentially logging out to login page
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">JT</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">姣恬科技</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            内部质量管理系统
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800">
           {showUserMenu && (
             <div ref={userMenuRef} className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden animate-fade-in z-50">
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center"
                  onClick={handleSwitchAccount}
                >
                  <Users size={16} className="mr-2" /> 切换账号
                </button>
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center border-t border-slate-700"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" /> 退出系统
                </button>
             </div>
           )}
          <div 
            className="flex items-center p-4 cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img
              className="h-9 w-9 rounded-full border border-slate-600 object-cover"
              src={user.avatar}
              alt={user.name}
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.department}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
