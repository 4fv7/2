// FinanceFlow - Main Application
class FinanceFlowApp {
  constructor() {
    this.currentSection = 'dashboard';
    this.transactions = [];
    this.budgets = {};
    this.theme = 'light';
    
    // Initialize app
    this.init();
  }

  init() {
    // Load data from localStorage
    this.loadData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize theme
    this.initTheme();
    
    // Populate initial data if empty
    this.initializeDefaultData();
    
    // Update UI
    this.updateDashboard();
    this.updateTransactionsList();
    this.updateBudgetSection();
    this.updateAnalytics();
    
    // Hide loading screen and show app
    setTimeout(() => {
      document.getElementById('loading-screen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
      }, 300);
    }, 1000);
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateToSection(section);
      });
    });

    // View all buttons
    document.querySelectorAll('.view-all-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateToSection(section);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add transaction modal
    document.getElementById('add-transaction-btn').addEventListener('click', () => {
      this.openTransactionModal();
    });

    document.getElementById('add-first-transaction').addEventListener('click', () => {
      this.openTransactionModal();
    });

    // Transaction form
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTransaction();
    });

    document.getElementById('cancel-transaction').addEventListener('click', () => {
      this.closeTransactionModal();
    });

    document.getElementById('modal-close').addEventListener('click', () => {
      this.closeTransactionModal();
    });

    // Budget modal
    document.getElementById('add-budget-btn').addEventListener('click', () => {
      this.openBudgetModal();
    });

    document.getElementById('create-first-budget').addEventListener('click', () => {
      this.openBudgetModal();
    });

    document.getElementById('budget-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveBudget();
    });

    document.getElementById('cancel-budget').addEventListener('click', () => {
      this.closeBudgetModal();
    });

    document.getElementById('budget-modal-close').addEventListener('click', () => {
      this.closeBudgetModal();
    });

    // Transaction filters
    document.getElementById('transaction-search').addEventListener('input', () => {
      this.filterTransactions();
    });

    document.getElementById('category-filter').addEventListener('change', () => {
      this.filterTransactions();
    });

    document.getElementById('type-filter').addEventListener('change', () => {
      this.filterTransactions();
    });

    // Period filters
    document.getElementById('dashboard-period').addEventListener('change', () => {
      this.updateDashboard();
    });

    document.getElementById('analytics-period').addEventListener('change', () => {
      this.updateAnalytics();
    });

    // Transaction type change
    document.getElementById('transaction-type').addEventListener('change', (e) => {
      this.updateCategoryOptions(e.target.value);
    });

    // Modal backdrop clicks
    document.getElementById('transaction-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeTransactionModal();
      }
    });

    document.getElementById('budget-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeBudgetModal();
      }
    });

    // Chart controls
    document.querySelectorAll('.chart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chartType = e.currentTarget.dataset.chart;
        this.updateChartType(chartType);
      });
    });
  }

  navigateToSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    this.currentSection = sectionId;

    // Update section-specific data
    switch (sectionId) {
      case 'dashboard':
        this.updateDashboard();
        break;
      case 'transactions':
        this.updateTransactionsList();
        break;
      case 'budget':
        this.updateBudgetSection();
        break;
      case 'analytics':
        this.updateAnalytics();
        break;
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('financeflow-theme') || 'light';
    this.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('#theme-toggle i');
    themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('financeflow-theme', this.theme);
    
    const themeIcon = document.querySelector('#theme-toggle i');
    themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }

  loadData() {
    const savedTransactions = localStorage.getItem('financeflow-transactions');
    const savedBudgets = localStorage.getItem('financeflow-budgets');
    
    this.transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    this.budgets = savedBudgets ? JSON.parse(savedBudgets) : {};
  }

  saveData() {
    localStorage.setItem('financeflow-transactions', JSON.stringify(this.transactions));
    localStorage.setItem('financeflow-budgets', JSON.stringify(this.budgets));
  }

  initializeDefaultData() {
    if (this.transactions.length === 0) {
      // Add some sample data for demonstration
      const sampleTransactions = [
        {
          id: this.generateId(),
          type: 'income',
          amount: 3500,
          description: 'Salary',
          category: 'income',
          date: this.getDateString(-5),
          timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000)
        },
        {
          id: this.generateId(),
          type: 'expense',
          amount: 85.50,
          description: 'Grocery Shopping',
          category: 'food',
          date: this.getDateString(-3),
          timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000)
        },
        {
          id: this.generateId(),
          type: 'expense',
          amount: 45.00,
          description: 'Gas Station',
          category: 'transportation',
          date: this.getDateString(-2),
          timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000)
        },
        {
          id: this.generateId(),
          type: 'expense',
          amount: 25.99,
          description: 'Netflix Subscription',
          category: 'entertainment',
          date: this.getDateString(-1),
          timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000)
        }
      ];
      
      this.transactions = sampleTransactions;
      this.saveData();
    }

    if (Object.keys(this.budgets).length === 0) {
      // Add some sample budgets
      this.budgets = {
        food: 400,
        transportation: 200,
        entertainment: 150,
        shopping: 300,
        bills: 800
      };
      this.saveData();
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getDateString(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getCategoryIcon(category) {
    const icons = {
      food: 'fas fa-utensils',
      transportation: 'fas fa-car',
      entertainment: 'fas fa-film',
      shopping: 'fas fa-shopping-bag',
      bills: 'fas fa-file-invoice-dollar',
      healthcare: 'fas fa-heartbeat',
      income: 'fas fa-dollar-sign',
      other: 'fas fa-question-circle'
    };
    return icons[category] || icons.other;
  }

  getCategoryColor(category) {
    const colors = {
      food: '#ef4444',
      transportation: '#3b82f6',
      entertainment: '#8b5cf6',
      shopping: '#f59e0b',
      bills: '#10b981',
      healthcare: '#ec4899',
      income: '#10b981',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  }

  getCategoryName(category) {
    const names = {
      food: 'Food & Dining',
      transportation: 'Transportation',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      bills: 'Bills & Utilities',
      healthcare: 'Healthcare',
      income: 'Income',
      other: 'Other'
    };
    return names[category] || 'Other';
  }

  getTransactionsInPeriod(days) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.transactions.filter(t => t.timestamp >= cutoff);
  }

  calculateSummaryStats(transactions) {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    
    return { income, expenses, balance, savingsRate };
  }

  updateDashboard() {
    const period = parseInt(document.getElementById('dashboard-period').value);
    const transactions = this.getTransactionsInPeriod(period);
    const stats = this.calculateSummaryStats(transactions);
    
    // Update summary cards
    document.getElementById('total-balance').textContent = this.formatCurrency(stats.balance);
    document.getElementById('monthly-income').textContent = this.formatCurrency(stats.income);
    document.getElementById('monthly-expenses').textContent = this.formatCurrency(stats.expenses);
    document.getElementById('savings-rate').textContent = `${stats.savingsRate.toFixed(1)}%`;
    
    // Update recent transactions
    this.updateRecentTransactions();
    
    // Update charts
    this.updateDashboardCharts(transactions);
  }

  updateRecentTransactions() {
    const recentTransactions = this.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    
    const container = document.getElementById('recent-transactions');
    
    if (recentTransactions.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500">No transactions yet</p>';
      return;
    }
    
    container.innerHTML = recentTransactions.map(transaction => `
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category)}20; color: ${this.getCategoryColor(transaction.category)}">
            <i class="${this.getCategoryIcon(transaction.category)}"></i>
          </div>
          <div class="transaction-details">
            <h4>${transaction.description}</h4>
            <div class="transaction-meta">
              <span>${this.getCategoryName(transaction.category)}</span>
              <span>${this.formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
        </div>
      </div>
    `).join('');
  }

  updateTransactionsList() {
    this.filterTransactions();
  }

  filterTransactions() {
    const searchTerm = document.getElementById('transaction-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    
    let filteredTransactions = this.transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                           this.getCategoryName(transaction.category).toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
      const matchesType = !typeFilter || transaction.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesType;
    });
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    const container = document.getElementById('transactions-list');
    const noTransactions = document.getElementById('no-transactions');
    
    if (filteredTransactions.length === 0) {
      container.classList.add('hidden');
      noTransactions.classList.remove('hidden');
      return;
    }
    
    container.classList.remove('hidden');
    noTransactions.classList.add('hidden');
    
    container.innerHTML = filteredTransactions.map(transaction => `
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-icon" style="background-color: ${this.getCategoryColor(transaction.category)}20; color: ${this.getCategoryColor(transaction.category)}">
            <i class="${this.getCategoryIcon(transaction.category)}"></i>
          </div>
          <div class="transaction-details">
            <h4>${transaction.description}</h4>
            <div class="transaction-meta">
              <span>${this.getCategoryName(transaction.category)}</span>
              <span>${this.formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
        </div>
      </div>
    `).join('');
  }

  updateBudgetSection() {
    const budgetCategories = document.getElementById('budget-categories');
    const noBudgets = document.getElementById('no-budgets');
    
    if (Object.keys(this.budgets).length === 0) {
      budgetCategories.classList.add('hidden');
      noBudgets.classList.remove('hidden');
      return;
    }
    
    budgetCategories.classList.remove('hidden');
    noBudgets.classList.add('hidden');
    
    // Calculate spending for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = this.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    let totalBudget = 0;
    let totalSpent = 0;
    
    const budgetHTML = Object.entries(this.budgets).map(([category, budget]) => {
      const spent = monthlyTransactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const remaining = budget - spent;
      const percentage = (spent / budget) * 100;
      
      totalBudget += budget;
      totalSpent += spent;
      
      return `
        <div class="budget-category">
          <div class="budget-category-header">
            <div class="budget-category-info">
              <h4>${this.getCategoryName(category)}</h4>
              <div class="budget-category-amounts">
                <span>Spent: ${this.formatCurrency(spent)}</span>
                <span>Budget: ${this.formatCurrency(budget)}</span>
                <span>Remaining: ${this.formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>
          <div class="budget-category-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${percentage > 100 ? 'var(--danger-color)' : 'var(--primary-color)'}"></div>
            </div>
            <span class="progress-text">${percentage.toFixed(1)}%</span>
          </div>
        </div>
      `;
    }).join('');
    
    budgetCategories.innerHTML = budgetHTML;
    
    // Update budget overview
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    document.getElementById('total-budget').textContent = this.formatCurrency(totalBudget);
    document.getElementById('total-spent').textContent = this.formatCurrency(totalSpent);
    document.getElementById('total-remaining').textContent = this.formatCurrency(totalRemaining);
    document.getElementById('overall-budget-progress').style.width = `${Math.min(overallPercentage, 100)}%`;
    document.getElementById('overall-budget-percentage').textContent = `${overallPercentage.toFixed(1)}%`;
  }

  updateAnalytics() {
    const period = parseInt(document.getElementById('analytics-period').value);
    const transactions = this.getTransactionsInPeriod(period);
    
    // Update analytics charts
    this.updateAnalyticsCharts(transactions);
    
    // Update financial health score
    this.updateHealthScore(transactions);
  }

  updateHealthScore(transactions) {
    const stats = this.calculateSummaryStats(transactions);
    
    // Calculate individual scores (0-25 each)
    const savingsScore = Math.min(25, Math.max(0, (stats.savingsRate / 20) * 25)); // 20% savings = full score
    const budgetScore = this.calculateBudgetScore();
    const consistencyScore = this.calculateConsistencyScore(transactions);
    const growthScore = this.calculateGrowthScore();
    
    const totalScore = Math.round(savingsScore + budgetScore + consistencyScore + growthScore);
    
    // Update UI
    document.getElementById('health-score').textContent = totalScore;
    document.getElementById('savings-score').textContent = `${Math.round(savingsScore)}/25`;
    document.getElementById('budget-score').textContent = `${Math.round(budgetScore)}/25`;
    document.getElementById('consistency-score').textContent = `${Math.round(consistencyScore)}/25`;
    document.getElementById('growth-score').textContent = `${Math.round(growthScore)}/25`;
    
    // Update score circle
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.style.setProperty('--score', totalScore);
  }

  calculateBudgetScore() {
    // Simple budget adherence score
    const budgetCategories = Object.keys(this.budgets);
    if (budgetCategories.length === 0) return 0;
    
    let adherenceSum = 0;
    budgetCategories.forEach(category => {
      const budget = this.budgets[category];
      const spent = this.getMonthlySpending(category);
      const adherence = Math.max(0, Math.min(1, (budget - spent) / budget + 1));
      adherenceSum += adherence;
    });
    
    return (adherenceSum / budgetCategories.length) * 25;
  }

  calculateConsistencyScore(transactions) {
    // Calculate spending consistency (lower variance = higher score)
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length < 7) return 15; // Default score for insufficient data
    
    const dailySpending = {};
    expenses.forEach(t => {
      const date = t.date;
      dailySpending[date] = (dailySpending[date] || 0) + t.amount;
    });
    
    const amounts = Object.values(dailySpending);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const coefficient = variance / (mean * mean);
    
    // Lower coefficient of variation = higher score
    return Math.max(0, Math.min(25, 25 - (coefficient * 10)));
  }

  calculateGrowthScore() {
    // Simple growth score based on recent vs older transactions
    const recentTransactions = this.getTransactionsInPeriod(30);
    const olderTransactions = this.getTransactionsInPeriod(60).filter(t => 
      t.timestamp < Date.now() - (30 * 24 * 60 * 60 * 1000)
    );
    
    if (olderTransactions.length === 0) return 15; // Default score
    
    const recentBalance = this.calculateSummaryStats(recentTransactions).balance;
    const olderBalance = this.calculateSummaryStats(olderTransactions).balance;
    
    const growth = recentBalance - olderBalance;
    return Math.max(0, Math.min(25, (growth / 1000) * 25)); // $1000 growth = full score
  }

  getMonthlySpending(category) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               t.category === category &&
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }

  openTransactionModal(transaction = null) {
    const modal = document.getElementById('transaction-modal');
    const form = document.getElementById('transaction-form');
    const title = document.getElementById('modal-title');
    
    if (transaction) {
      title.textContent = 'Edit Transaction';
      document.getElementById('transaction-type').value = transaction.type;
      document.getElementById('transaction-amount').value = transaction.amount;
      document.getElementById('transaction-description').value = transaction.description;
      document.getElementById('transaction-category').value = transaction.category;
      document.getElementById('transaction-date').value = transaction.date;
      form.dataset.editId = transaction.id;
    } else {
      title.textContent = 'Add Transaction';
      form.reset();
      document.getElementById('transaction-date').value = this.getDateString();
      delete form.dataset.editId;
    }
    
    this.updateCategoryOptions(document.getElementById('transaction-type').value);
    modal.classList.add('active');
  }

  closeTransactionModal() {
    const modal = document.getElementById('transaction-modal');
    modal.classList.remove('active');
  }

  updateCategoryOptions(type) {
    const categorySelect = document.getElementById('transaction-category');
    const expenseOptions = `
      <option value="">Select category</option>
      <option value="food">Food & Dining</option>
      <option value="transportation">Transportation</option>
      <option value="entertainment">Entertainment</option>
      <option value="shopping">Shopping</option>
      <option value="bills">Bills & Utilities</option>
      <option value="healthcare">Healthcare</option>
      <option value="other">Other</option>
    `;
    
    const incomeOptions = `
      <option value="">Select category</option>
      <option value="income">Income</option>
      <option value="other">Other</option>
    `;
    
    categorySelect.innerHTML = type === 'income' ? incomeOptions : expenseOptions;
  }

  saveTransaction() {
    const form = document.getElementById('transaction-form');
    const formData = new FormData(form);
    
    const transaction = {
      id: form.dataset.editId || this.generateId(),
      type: document.getElementById('transaction-type').value,
      amount: parseFloat(document.getElementById('transaction-amount').value),
      description: document.getElementById('transaction-description').value,
      category: document.getElementById('transaction-category').value,
      date: document.getElementById('transaction-date').value,
      timestamp: new Date(document.getElementById('transaction-date').value).getTime()
    };
    
    if (form.dataset.editId) {
      // Edit existing transaction
      const index = this.transactions.findIndex(t => t.id === form.dataset.editId);
      this.transactions[index] = transaction;
      this.showToast('Transaction updated successfully', 'success');
    } else {
      // Add new transaction
      this.transactions.push(transaction);
      this.showToast('Transaction added successfully', 'success');
    }
    
    this.saveData();
    this.closeTransactionModal();
    
    // Update UI
    this.updateDashboard();
    this.updateTransactionsList();
    this.updateBudgetSection();
    this.updateAnalytics();
  }

  openBudgetModal() {
    const modal = document.getElementById('budget-modal');
    document.getElementById('budget-form').reset();
    modal.classList.add('active');
  }

  closeBudgetModal() {
    const modal = document.getElementById('budget-modal');
    modal.classList.remove('active');
  }

  saveBudget() {
    const category = document.getElementById('budget-category').value;
    const amount = parseFloat(document.getElementById('budget-amount').value);
    
    this.budgets[category] = amount;
    this.saveData();
    this.closeBudgetModal();
    
    this.showToast('Budget saved successfully', 'success');
    this.updateBudgetSection();
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle'
    };
    
    icon.className = `toast-icon ${icons[type]}`;
    messageEl.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  updateDashboardCharts(transactions) {
    // This will be implemented in charts.js
    if (window.ChartsManager) {
      window.ChartsManager.updateDashboardCharts(transactions);
    }
  }

  updateAnalyticsCharts(transactions) {
    // This will be implemented in charts.js
    if (window.ChartsManager) {
      window.ChartsManager.updateAnalyticsCharts(transactions);
    }
  }

  updateChartType(chartType) {
    // Update chart type buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
    
    // Update chart
    if (window.ChartsManager) {
      window.ChartsManager.updateSpendingChart(chartType);
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FinanceFlowApp();
});

