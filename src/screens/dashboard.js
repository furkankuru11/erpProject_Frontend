import React, { useState } from "react";
import '../screens_css/dashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js'yi kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Örnek stok verileri
  const criticalStocks = [
    { name: 'Ürün A', current: 15, minimum: 20, maximum: 100 },
    { name: 'Ürün B', current: 8, minimum: 25, maximum: 150 },
    { name: 'Ürün C', current: 5, minimum: 30, maximum: 120 },
    { name: 'Ürün D', current: 12, minimum: 15, maximum: 80 },
  ];

  // Örnek bekleyen siparişler
  const pendingOrders = [
    { id: '1234', customer: 'ABC Ltd.', product: 'Ürün X', quantity: 50, date: '2024-03-20', status: 'waiting' },
    { id: '1235', customer: 'XYZ A.Ş.', product: 'Ürün Y', quantity: 30, date: '2024-03-19', status: 'processing' },
    { id: '1236', customer: 'DEF Corp.', product: 'Ürün Z', quantity: 25, date: '2024-03-18', status: 'waiting' },
    { id: '1237', customer: 'GHI Inc.', product: 'Ürün W', quantity: 40, date: '2024-03-17', status: 'processing' },
  ];

  // Örnek fatura verileri
  const invoiceStats = {
    totalInvoices: 125,
    unpaidInvoices: 28,
    totalAmount: 245000,
    unpaidAmount: 68500,
    recentInvoices: [
      { id: 'INV001', customer: 'ABC Ltd.', amount: 12500, dueDate: '2024-03-25', status: 'unpaid' },
      { id: 'INV002', customer: 'XYZ A.Ş.', amount: 8750, dueDate: '2024-03-23', status: 'overdue' },
      { id: 'INV003', customer: 'DEF Corp.', amount: 15000, dueDate: '2024-03-28', status: 'unpaid' },
      { id: 'INV004', customer: 'GHI Inc.', amount: 9800, dueDate: '2024-03-22', status: 'overdue' },
    ]
  };

  // Grafik için örnek veriler
  const salesData = {
    daily: {
      labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      data: [4500, 5200, 4800, 6200, 5100, 7200, 6100]
    },
    weekly: {
      labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
      data: [28000, 32000, 35000, 38000]
    },
    monthly: {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      data: [120000, 135000, 142000, 148000, 155000, 162000]
    }
  };

  // Nakit akışı verileri
  const cashFlowData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    income: [85000, 92000, 88000, 97000, 94000, 102000],
    expenses: [65000, 68000, 72000, 75000, 70000, 78000]
  };

  const [chartType, setChartType] = useState('daily');
  const [graphType, setGraphType] = useState('line');

  // Grafik seçenekleri
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'daily' ? 'Günlük Satışlar' : 
              chartType === 'weekly' ? 'Haftalık Satışlar' : 'Aylık Satışlar'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₺${value.toLocaleString()}`
        }
      }
    }
  };

  // Grafik verisi
  const chartData = {
    labels: salesData[chartType].labels,
    datasets: [
      {
        label: 'Satış',
        data: salesData[chartType].data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Nakit akışı grafik seçenekleri
  const cashFlowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nakit Akışı',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₺${context.parsed.y.toLocaleString()}`;
          }
        }
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
          callback: (value) => `₺${value.toLocaleString()}`
        }
      }
    }
  };

  // Nakit akışı grafik verisi
  const cashFlowChartData = {
    labels: cashFlowData.labels,
    datasets: [
      {
        label: 'Gelir',
        data: cashFlowData.income,
        backgroundColor: 'rgba(34, 197, 94, 0.5)', // Yeşil
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Gider',
        data: cashFlowData.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.5)', // Kırmızı
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ]
  };

  // Stok analiz verileri
  const stockAnalytics = {
    topSelling: [
      { name: 'Ürün X', sold: 1250, revenue: 125000, stock: 45 },
      { name: 'Ürün Y', sold: 980, revenue: 98000, stock: 32 },
      { name: 'Ürün Z', sold: 850, revenue: 85000, stock: 28 },
      { name: 'Ürün W', sold: 720, revenue: 72000, stock: 15 },
    ],
    criticalStock: criticalStocks.filter(stock => stock.current < stock.minimum),
    stockTrends: {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      datasets: {
        'Ürün X': [120, 100, 85, 65, 45, 45],
        'Ürün Y': [80, 65, 50, 42, 32, 32],
        'Ürün Z': [95, 80, 65, 48, 28, 28],
        'Ürün W': [60, 45, 35, 25, 15, 15],
      }
    }
  };

  // Stok trend grafik seçenekleri
  const stockTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stok Seviyesi Değişimi',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stok Miktarı'
        }
      }
    }
  };

  // Stok trend verisi
  const stockTrendData = {
    labels: stockAnalytics.stockTrends.labels,
    datasets: Object.entries(stockAnalytics.stockTrends.datasets).map(([key, value]) => ({
      label: key,
      data: value,
      borderWidth: 2,
      tension: 0.4
    }))
  };

  // Favori raporlar için örnek veriler
  const favoriteReports = [
    { id: 1, name: 'Günlük Satış Raporu', icon: 'fas fa-chart-line' },
    { id: 2, name: 'Stok Durum Raporu', icon: 'fas fa-boxes' },
    { id: 3, name: 'Nakit Akış Raporu', icon: 'fas fa-money-bill-wave' },
  ];

  const [showReportsMenu, setShowReportsMenu] = useState(false);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Genel Bakış</h1>
        </div>
        
        <div className="header-actions">
          <button className="action-button primary">
            <i className="fas fa-plus"></i>
            <span>Hızlı Satış</span>
          </button>
          
          <button className="action-button">
            <i className="fas fa-box"></i>
            <span>Stok Güncelle</span>
          </button>
          
          <div className="reports-dropdown">
            <button 
              className="action-button"
              onClick={() => setShowReportsMenu(!showReportsMenu)}
            >
              <i className="fas fa-star"></i>
              <span>Favori Raporlar</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            
            {showReportsMenu && (
              <div className="dropdown-menu">
                {favoriteReports.map(report => (
                  <button key={report.id} className="menu-item">
                    <i className={report.icon}></i>
                    <span>{report.name}</span>
                  </button>
                ))}
                <div className="menu-divider"></div>
                <button className="menu-item">
                  <i className="fas fa-cog"></i>
                  <span>Raporları Düzenle</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cards-container">
        <div className="card daily-income">
          <div className="card-header">
            <i className="fas fa-coins"></i>
            <span>Günlük</span>
          </div>
          <div className="card-body">
            <h3>₺1,234</h3>
            <div className="trend up">
              <i className="fas fa-arrow-up"></i>
              <span>12.5%</span>
            </div>
          </div>
        </div>

        <div className="card monthly-income">
          <div className="card-header">
            <i className="fas fa-calendar-alt"></i>
            <span>Aylık</span>
          </div>
          <div className="card-body">
            <h3>₺28,567</h3>
            <div className="trend up">
              <i className="fas fa-arrow-up"></i>
              <span>8.3%</span>
            </div>
          </div>
        </div>

        <div className="card yearly-income">
          <div className="card-header">
            <i className="fas fa-chart-line"></i>
            <span>Yıllık</span>
          </div>
          <div className="card-body">
            <h3>₺342K</h3>
            <div className="trend up">
              <i className="fas fa-arrow-up"></i>
              <span>15.2%</span>
            </div>
          </div>
        </div>

        <div className="card total-income">
          <div className="card-header">
            <i className="fas fa-wallet"></i>
            <span>Toplam</span>
          </div>
          <div className="card-body">
            <h3>₺1.2M</h3>
            <div className="trend up">
              <i className="fas fa-arrow-up"></i>
              <span>25.8%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stock-section">
        <h2 className="section-title">Kritik Stok Seviyeleri</h2>
        <div className="stock-grid">
          {criticalStocks.map((stock, index) => {
            const percentage = (stock.current / stock.maximum) * 100;
            const isLow = stock.current < stock.minimum;

            return (
              <div key={index} className="stock-card">
                <div className="stock-info">
                  <h3>{stock.name}</h3>
                  <span className={`stock-status ${isLow ? 'critical' : 'normal'}`}>
                    {isLow ? 'Kritik Seviye' : 'Normal'}
                  </span>
                </div>
                <div className="stock-details">
                  <div className="stock-bar-container">
                    <div 
                      className={`stock-bar ${isLow ? 'critical' : 'normal'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="stock-numbers">
                    <span className="current">{stock.current} adet</span>
                    <span className="minimum">Min: {stock.minimum}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="orders-section">
        <h2 className="section-title">Bekleyen Siparişler</h2>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Ürün</th>
                <th>Miktar</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity} adet</td>
                  <td>{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'waiting' ? 'Beklemede' : 'İşleme Alındı'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="invoice-section">
        <h2 className="section-title">Fatura Durumu</h2>
        
        <div className="invoice-stats-grid">
          <div className="invoice-stat-card">
            <div className="stat-icon">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Toplam Fatura</span>
              <h3>{invoiceStats.totalInvoices}</h3>
              <span className="stat-amount">₺{invoiceStats.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="invoice-stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Ödenmemiş Fatura</span>
              <h3>{invoiceStats.unpaidInvoices}</h3>
              <span className="stat-amount">₺{invoiceStats.unpaidAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="invoice-stat-card success">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-label">Tahsil Edilen</span>
              <h3>{invoiceStats.totalInvoices - invoiceStats.unpaidInvoices}</h3>
              <span className="stat-amount">₺{(invoiceStats.totalAmount - invoiceStats.unpaidAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="recent-invoices">
          <h3 className="subsection-title">Yaklaşan Ödemeler</h3>
          <div className="invoice-list">
            {invoiceStats.recentInvoices.map((invoice) => (
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-details">
                  <span className="invoice-id">{invoice.id}</span>
                  <span className="invoice-customer">{invoice.customer}</span>
                </div>
                <div className="invoice-amount">
                  ₺{invoice.amount.toLocaleString()}
                </div>
                <div className="invoice-due-date">
                  <i className="far fa-calendar-alt"></i>
                  {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                </div>
                <span className={`invoice-status ${invoice.status}`}>
                  {invoice.status === 'overdue' ? 'Gecikmiş' : 'Ödenmemiş'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sales-chart-section">
        <div className="chart-header">
          <h2 className="section-title">Satış Grafiği</h2>
          <div className="chart-controls">
            <div className="period-selector">
              <button 
                className={`chart-btn ${chartType === 'daily' ? 'active' : ''}`}
                onClick={() => setChartType('daily')}
              >
                Günlük
              </button>
              <button 
                className={`chart-btn ${chartType === 'weekly' ? 'active' : ''}`}
                onClick={() => setChartType('weekly')}
              >
                Haftalık
              </button>
              <button 
                className={`chart-btn ${chartType === 'monthly' ? 'active' : ''}`}
                onClick={() => setChartType('monthly')}
              >
                Aylık
              </button>
            </div>
            <div className="chart-type-selector">
              <button 
                className={`chart-btn ${graphType === 'line' ? 'active' : ''}`}
                onClick={() => setGraphType('line')}
              >
                <i className="fas fa-chart-line"></i>
              </button>
              <button 
                className={`chart-btn ${graphType === 'bar' ? 'active' : ''}`}
                onClick={() => setGraphType('bar')}
              >
                <i className="fas fa-chart-bar"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="chart-container">
          {graphType === 'line' ? (
            <Line options={options} data={chartData} />
          ) : (
            <Bar options={options} data={chartData} />
          )}
        </div>
      </div>

      <div className="cash-flow-section">
        <div className="section-header">
          <h2 className="section-title">Nakit Akışı</h2>
          <div className="cash-flow-summary">
            <div className="summary-item income">
              <span className="label">Toplam Gelir</span>
              <span className="amount">
                ₺{cashFlowData.income.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
            </div>
            <div className="summary-item expenses">
              <span className="label">Toplam Gider</span>
              <span className="amount">
                ₺{cashFlowData.expenses.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
            </div>
            <div className="summary-item profit">
              <span className="label">Net Kar</span>
              <span className="amount">
                ₺{(cashFlowData.income.reduce((a, b) => a + b, 0) - 
                   cashFlowData.expenses.reduce((a, b) => a + b, 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <Bar options={cashFlowOptions} data={cashFlowChartData} />
        </div>
      </div>

      <div className="stock-analytics-section">
        <h2 className="section-title">Stok Analizi</h2>
        
        <div className="analytics-grid">
          <div className="top-selling-card">
            <h3 className="subsection-title">En Çok Satan Ürünler</h3>
            <div className="top-selling-list">
              {stockAnalytics.topSelling.map((product, index) => (
                <div key={index} className="top-selling-item">
                  <div className="product-info">
                    <span className="rank">#{index + 1}</span>
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <span className="sales-count">{product.sold} Adet Satış</span>
                    </div>
                  </div>
                  <div className="product-stats">
                    <div className="stat">
                      <span className="label">Gelir</span>
                      <span className="value">₺{product.revenue.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Stok</span>
                      <span className={`value ${product.stock < 30 ? 'warning' : ''}`}>
                        {product.stock} Adet
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stock-trend-card">
            <h3 className="subsection-title">Stok Seviyesi Değişimi</h3>
            <div className="chart-container">
              <Line options={stockTrendOptions} data={stockTrendData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;