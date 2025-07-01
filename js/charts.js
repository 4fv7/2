// Charts Manager for FinanceFlow
class ChartsManager {
  constructor() {
    this.charts = {};
    this.colors = {
      primary: '#2563eb',
      secondary: '#10b981',
      accent: '#f59e0b',
      danger: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      food: '#ef4444',
      transportation: '#3b82f6',
      entertainment: '#8b5cf6',
      shopping: '#f59e0b',
      bills: '#10b981',
      healthcare: '#ec4899',
      income: '#10b981',
      other: '#6b7280'
    };
    
    this.init();
  }

  init() {
    // Set Chart.js defaults
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  initializeCharts() {
    this.initSpendingChart();
    this.initCategoryChart();
    this.initAnalyticsCharts();
  }

  initSpendingChart() {
    const ctx = document.getElementById('spending-chart');
    if (!ctx) return;

    this.charts.spending = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Daily Spending',
          data: [],
          borderColor: this.colors.primary,
          backgroundColor: this.colors.primary + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toFixed(0);
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  initCategoryChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;

    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  initAnalyticsCharts() {
    // Analytics Category Chart
    const analyticsCategoryCtx = document.getElementById('analytics-category-chart');
    if (analyticsCategoryCtx) {
      this.charts.analyticsCategory = new Chart(analyticsCategoryCtx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Spending by Category',
            data: [],
            backgroundColor: this.colors.primary + '80',
            borderColor: this.colors.primary,
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }

    // Monthly Comparison Chart
    const monthlyComparisonCtx = document.getElementById('monthly-comparison-chart');
    if (monthlyComparisonCtx) {
      this.charts.monthlyComparison = new Chart(monthlyComparisonCtx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Income',
              data: [],
              backgroundColor: this.colors.success + '80',
              borderColor: this.colors.success,
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Expenses',
              data: [],
              backgroundColor: this.colors.danger + '80',
              borderColor: this.colors.danger,
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }

    // Income vs Expenses Chart
    const incomeExpenseCtx = document.getElementById('income-expense-chart');
    if (incomeExpenseCtx) {
      this.charts.incomeExpense = new Chart(incomeExpenseCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Income',
              data: [],
              borderColor: this.colors.success,
              backgroundColor: this.colors.success + '20',
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: 'Expenses',
              data: [],
              borderColor: this.colors.danger,
              backgroundColor: this.colors.danger + '20',
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toFixed(0);
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }
  }

  updateDashboardCharts(transactions) {
    this.updateSpendingChart('line', transactions);
    this.updateCategoryChart(transactions);
  }

  updateSpendingChart(type = 'line', transactions = null) {
    if (!this.charts.spending) return;

    const chart = this.charts.spending;
    
    // Get transactions if not provided
    if (!transactions) {
      const period = parseInt(document.getElementById('dashboard-period').value);
      transactions = window.app.getTransactionsInPeriod(period);
    }

    // Process data for chart
    const dailySpending = this.getDailySpending(transactions);
    const labels = Object.keys(dailySpending).sort();
    const data = labels.map(date => dailySpending[date] || 0);

    // Update chart type if changed
    if (chart.config.type !== type) {
      chart.config.type = type;
      if (type === 'bar') {
        chart.data.datasets[0].backgroundColor = this.colors.primary + '80';
        chart.data.datasets[0].borderColor = this.colors.primary;
        chart.data.datasets[0].fill = false;
      } else {
        chart.data.datasets[0].backgroundColor = this.colors.primary + '20';
        chart.data.datasets[0].borderColor = this.colors.primary;
        chart.data.datasets[0].fill = true;
      }
    }

    // Update data
    chart.data.labels = labels.map(date => this.formatDateForChart(date));
    chart.data.datasets[0].data = data;
    chart.update();
  }

  updateCategoryChart(transactions) {
    if (!this.charts.category) return;

    const chart = this.charts.category;
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryTotals = {};
    expenses.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    // Prepare chart data
    const labels = Object.keys(categoryTotals).map(cat => window.app.getCategoryName(cat));
    const data = Object.values(categoryTotals);
    const colors = Object.keys(categoryTotals).map(cat => this.colors[cat] || this.colors.other);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.update();
  }

  updateAnalyticsCharts(transactions) {
    this.updateAnalyticsCategoryChart(transactions);
    this.updateMonthlyComparisonChart(transactions);
    this.updateIncomeExpenseChart(transactions);
  }

  updateAnalyticsCategoryChart(transactions) {
    if (!this.charts.analyticsCategory) return;

    const chart = this.charts.analyticsCategory;
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryTotals = {};
    expenses.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    // Sort by amount
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 categories

    const labels = sortedCategories.map(([cat]) => window.app.getCategoryName(cat));
    const data = sortedCategories.map(([,amount]) => amount);
    const colors = sortedCategories.map(([cat]) => this.colors[cat] || this.colors.other);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors + '80';
    chart.data.datasets[0].borderColor = colors;
    chart.update();
  }

  updateMonthlyComparisonChart(transactions) {
    if (!this.charts.monthlyComparison) return;

    const chart = this.charts.monthlyComparison;
    const monthlyData = this.getMonthlyData(transactions);

    const labels = Object.keys(monthlyData).sort();
    const incomeData = labels.map(month => monthlyData[month].income);
    const expenseData = labels.map(month => monthlyData[month].expenses);

    chart.data.labels = labels.map(month => this.formatMonthForChart(month));
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
  }

  updateIncomeExpenseChart(transactions) {
    if (!this.charts.incomeExpense) return;

    const chart = this.charts.incomeExpense;
    const dailyData = this.getDailyIncomeExpense(transactions);

    const labels = Object.keys(dailyData).sort();
    const incomeData = labels.map(date => dailyData[date].income);
    const expenseData = labels.map(date => dailyData[date].expenses);

    chart.data.labels = labels.map(date => this.formatDateForChart(date));
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
  }

  getDailySpending(transactions) {
    const dailySpending = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    
    expenses.forEach(transaction => {
      const date = transaction.date;
      dailySpending[date] = (dailySpending[date] || 0) + transaction.amount;
    });

    return dailySpending;
  }

  getDailyIncomeExpense(transactions) {
    const dailyData = {};
    
    transactions.forEach(transaction => {
      const date = transaction.date;
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        dailyData[date].income += transaction.amount;
      } else {
        dailyData[date].expenses += transaction.amount;
      }
    });

    return dailyData;
  }

  getMonthlyData(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    return monthlyData;
  }

  formatDateForChart(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  formatMonthForChart(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  }

  // Update chart colors when theme changes
  updateTheme() {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.options) {
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = borderColor;
        
        if (chart.options.scales) {
          Object.values(chart.options.scales).forEach(scale => {
            if (scale.ticks) {
              scale.ticks.color = textColor;
            }
            if (scale.grid) {
              scale.grid.color = borderColor;
            }
          });
        }
        
        chart.update();
      }
    });
  }

  // Destroy all charts (useful for cleanup)
  destroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }
}

// Initialize charts manager
document.addEventListener('DOMContentLoaded', () => {
  window.ChartsManager = new ChartsManager();
  
  // Update charts when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        setTimeout(() => {
          if (window.ChartsManager) {
            window.ChartsManager.updateTheme();
          }
        }, 100);
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});

