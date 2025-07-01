// Storage Manager for FinanceFlow
class StorageManager {
  constructor() {
    this.storageKeys = {
      transactions: 'financeflow-transactions',
      budgets: 'financeflow-budgets',
      settings: 'financeflow-settings',
      theme: 'financeflow-theme'
    };
    
    this.init();
  }

  init() {
    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Data will not persist.');
      return;
    }

    // Migrate old data if necessary
    this.migrateData();
  }

  isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  }

  // Transaction methods
  saveTransactions(transactions) {
    return this.setItem(this.storageKeys.transactions, transactions);
  }

  getTransactions() {
    return this.getItem(this.storageKeys.transactions, []);
  }

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    return this.saveTransactions(transactions);
  }

  updateTransaction(transactionId, updatedTransaction) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === transactionId);
    
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      return this.saveTransactions(transactions);
    }
    
    return false;
  }

  deleteTransaction(transactionId) {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== transactionId);
    return this.saveTransactions(filteredTransactions);
  }

  // Budget methods
  saveBudgets(budgets) {
    return this.setItem(this.storageKeys.budgets, budgets);
  }

  getBudgets() {
    return this.getItem(this.storageKeys.budgets, {});
  }

  setBudget(category, amount) {
    const budgets = this.getBudgets();
    budgets[category] = amount;
    return this.saveBudgets(budgets);
  }

  deleteBudget(category) {
    const budgets = this.getBudgets();
    delete budgets[category];
    return this.saveBudgets(budgets);
  }

  // Settings methods
  saveSettings(settings) {
    return this.setItem(this.storageKeys.settings, settings);
  }

  getSettings() {
    return this.getItem(this.storageKeys.settings, {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: true,
      autoBackup: false
    });
  }

  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    return this.saveSettings(settings);
  }

  // Theme methods
  saveTheme(theme) {
    return this.setItem(this.storageKeys.theme, theme);
  }

  getTheme() {
    return this.getItem(this.storageKeys.theme, 'light');
  }

  // Data export/import methods
  exportData() {
    const data = {
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!this.validateImportData(data)) {
        throw new Error('Invalid data format');
      }
      
      // Import data
      if (data.transactions) {
        this.saveTransactions(data.transactions);
      }
      
      if (data.budgets) {
        this.saveBudgets(data.budgets);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  }

  validateImportData(data) {
    // Basic validation
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Validate transactions
    if (data.transactions && Array.isArray(data.transactions)) {
      for (const transaction of data.transactions) {
        if (!transaction.id || !transaction.type || !transaction.amount || !transaction.date) {
          return false;
        }
      }
    }
    
    // Validate budgets
    if (data.budgets && typeof data.budgets !== 'object') {
      return false;
    }
    
    return true;
  }

  // Data migration for version updates
  migrateData() {
    const currentVersion = this.getItem('financeflow-version', '1.0');
    
    // Add migration logic here for future versions
    if (currentVersion === '1.0') {
      // No migration needed for initial version
      return;
    }
    
    // Update version after migration
    this.setItem('financeflow-version', '1.0');
  }

  // Backup methods
  createBackup() {
    const backup = {
      data: this.exportData(),
      timestamp: Date.now(),
      version: '1.0'
    };
    
    const backups = this.getItem('financeflow-backups', []);
    backups.push(backup);
    
    // Keep only last 5 backups
    if (backups.length > 5) {
      backups.splice(0, backups.length - 5);
    }
    
    return this.setItem('financeflow-backups', backups);
  }

  getBackups() {
    return this.getItem('financeflow-backups', []);
  }

  restoreBackup(backupIndex) {
    const backups = this.getBackups();
    
    if (backupIndex >= 0 && backupIndex < backups.length) {
      const backup = backups[backupIndex];
      return this.importData(backup.data);
    }
    
    return false;
  }

  // Clear all data
  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Also remove backups and version
      localStorage.removeItem('financeflow-backups');
      localStorage.removeItem('financeflow-version');
      
      return true;
    } catch (e) {
      console.error('Error clearing data:', e);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo() {
    let totalSize = 0;
    const itemSizes = {};
    
    Object.entries(this.storageKeys).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      const size = item ? new Blob([item]).size : 0;
      itemSizes[name] = size;
      totalSize += size;
    });
    
    return {
      totalSize,
      itemSizes,
      totalSizeFormatted: this.formatBytes(totalSize)
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Download data as file
  downloadData(filename = 'financeflow-data.json') {
    const data = this.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Upload data from file
  uploadData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const success = this.importData(e.target.result);
          resolve(success);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
}

// Initialize storage manager
document.addEventListener('DOMContentLoaded', () => {
  window.StorageManager = new StorageManager();
});

