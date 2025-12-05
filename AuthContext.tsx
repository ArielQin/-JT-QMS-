import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from './types';

// Mock User Database
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin': {
    username: 'admin',
    password: '123',
    name: '韦晓敏',
    role: 'Admin',
    department: '质量管理部 (负责人)',
    avatar: 'https://placehold.co/100x100/0f766e/ffffff?text=WX'
  },
  'operator': {
    username: 'operator',
    password: '123',
    name: '阳泽华',
    role: 'Operator',
    department: '生产车间',
    avatar: 'https://placehold.co/100x100/3b82f6/ffffff?text=YZ'
  },
  'auditor': {
    username: 'auditor',
    password: '123',
    name: '尤通',
    role: 'Auditor',
    department: '审计合规部',
    avatar: 'https://placehold.co/100x100/f59e0b/ffffff?text=YT'
  }
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to load user from localStorage on boot
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jt_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS[username];
    if (foundUser && foundUser.password === password) {
      const { password, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem('jt_user', JSON.stringify(safeUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jt_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
