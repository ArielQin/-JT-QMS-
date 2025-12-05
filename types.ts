
export enum Stage {
  RawMaterial = '产品采购',
  Production = '生产加工',
  Storage = '仓储物流',
  Sales = '销售终端'
}

export enum InputMode {
  Manual = '数据录入',
  Scanner = '扫码枪管理',
  Mobile = '移动端管理'
}

export type InventoryCategory = '中药饮片' | '中成药' | '化学药' | '医疗器械' | '消毒用品' | '包装材料' | '辅料' | '原料';

export type UserRole = 'Admin' | 'Operator' | 'Auditor';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  avatar: string;
  department: string;
}

export interface InventoryItem {
  id: string;
  drugName: string;
  image: string;
  category: InventoryCategory;
  batchNumber: string;
  manufacturer: string;
  specification: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate: string;
  inboundDate: string;
  status: 'Normal' | 'LowStock' | 'Expired';
  location: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string; // User friendly name
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Error';
  description: string; // User friendly description
  technicalDetails: string; // Code or JSON details
}

export interface TraceRecord {
  id: string;
  stage: Stage;
  timestamp: string;
  operator: string;
  location: string;
  details: string;
  status: 'Completed' | 'Pending';
}

export interface RiskMetric {
  category: string;
  riskLevel: number; // 0-100
  description: string;
}
