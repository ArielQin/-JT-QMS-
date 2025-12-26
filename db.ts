
import { InventoryItem, SecurityLog, Stage, InventoryCategory } from './types';

// 初始种子数据
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', drugName: '复方金银花颗粒', image: '', category: '中成药', batchNumber: '20251012-A001', manufacturer: '姣恬制药', specification: '10g*10袋', quantity: 2450, unit: '盒', price: 28.5, expiryDate: '2026-10-12', inboundDate: '2025-10-12', status: 'Normal', location: 'A-01-02' },
  { id: '2', drugName: '感冒灵胶囊', image: '', category: '中成药', batchNumber: '20250915-B022', manufacturer: '姣恬制药', specification: '0.5g*24粒', quantity: 120, unit: '盒', price: 15.0, expiryDate: '2026-09-15', inboundDate: '2025-09-20', status: 'LowStock', location: 'A-02-05' },
];

const INITIAL_LOGS: SecurityLog[] = [
  { id: 'L001', timestamp: new Date().toLocaleString(), user: '系统', action: 'DB_INIT', module: '系统核心', ipAddress: '127.0.0.1', status: 'Success', description: '数据库初始化成功', technicalDetails: '{"status": "initialized", "storage": "localStorage"}' }
];

class MockDatabase {
  private prefix = 'jt_db_';

  private async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 500));
  }

  private get<T>(key: string): T[] {
    const data = localStorage.getItem(this.prefix + key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  // 初始化数据库
  async init() {
    if (!localStorage.getItem(this.prefix + 'inventory')) {
      this.set('inventory', INITIAL_INVENTORY);
    }
    if (!localStorage.getItem(this.prefix + 'logs')) {
      this.set('logs', INITIAL_LOGS);
    }
  }

  // --- 库存管理 (CRUD) ---
  async queryInventory(filters?: { category?: string; status?: string; query?: string }): Promise<InventoryItem[]> {
    await this.delay();
    let data = this.get<InventoryItem>('inventory');
    if (filters) {
      if (filters.category && filters.category !== 'All') data = data.filter(i => i.category === filters.category);
      if (filters.status && filters.status !== 'All') data = data.filter(i => i.status === filters.status);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        data = data.filter(i => i.drugName.toLowerCase().includes(q) || i.batchNumber.toLowerCase().includes(q));
      }
    }
    return data;
  }

  async insertInventory(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    await this.delay();
    const data = this.get<InventoryItem>('inventory');
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    data.unshift(newItem);
    this.set('inventory', data);
    await this.addLog('DATA_INSERT', '库存管理', `新增库存条目: ${item.drugName}`, JSON.stringify(newItem));
    return newItem;
  }

  async updateStock(id: string, delta: number, type: 'in' | 'out'): Promise<InventoryItem> {
    await this.delay();
    const data = this.get<InventoryItem>('inventory');
    const index = data.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');

    const item = data[index];
    const newQty = type === 'in' ? item.quantity + delta : Math.max(0, item.quantity - delta);
    
    // 逻辑自动更新状态
    let newStatus: 'Normal' | 'LowStock' | 'Expired' = 'Normal';
    if (newQty <= 0) newStatus = 'Expired';
    else if (newQty < 200) newStatus = 'LowStock';

    const updatedItem = { ...item, quantity: newQty, status: newStatus };
    data[index] = updatedItem;
    this.set('inventory', data);
    
    await this.addLog('DATA_UPDATE', '库存管理', `${type === 'in' ? '入库' : '出库'}操作: ${item.drugName}, 变动: ${delta}`, JSON.stringify({ old: item.quantity, new: newQty }));
    return updatedItem;
  }

  // --- 安全日志 ---
  async queryLogs(): Promise<SecurityLog[]> {
    await this.delay(200);
    return this.get<SecurityLog>('logs').reverse();
  }

  async addLog(action: string, module: string, description: string, details: string): Promise<void> {
    const logs = this.get<SecurityLog>('logs');
    const user = JSON.parse(localStorage.getItem('jt_user') || '{"name":"系统"}');
    const newLog: SecurityLog = {
      id: 'L' + Date.now(),
      timestamp: new Date().toLocaleString(),
      user: user.name,
      action,
      module,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      status: action.includes('ERROR') ? 'Error' : 'Success',
      description,
      technicalDetails: details
    };
    logs.push(newLog);
    this.set('logs', logs);
  }

  // --- 溯源 ---
  async getTrace(batchNumber: string): Promise<InventoryItem | undefined> {
    await this.delay();
    const data = this.get<InventoryItem>('inventory');
    return data.find(i => i.batchNumber === batchNumber);
  }
}

export const db = new MockDatabase();
