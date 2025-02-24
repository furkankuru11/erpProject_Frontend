import React, { useState } from 'react';
import {Bar } from 'react-chartjs-2';
import '../screens_css/report.css';

const Report = () => {
  const [dateRange, setDateRange] = useState('weekly');


  // Örnek veri setleri
  const financialData = {
    weekly: {
      labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      sales: [15000, 18000, 16500, 19000, 22000, 25000, 20000],
      expenses: {
        personel: [5000, 5000, 5000, 5000, 5000, 6000, 6000],
        kira: [1000, 1000, 1000, 1000, 1000, 1000, 1000],
        utilities: [800, 750, 900, 850, 800, 900, 850],
        stock: [8000, 9000, 7500, 8500, 10000, 12000, 9000],
        other: [1200, 1500, 1300, 1400, 1600, 1800, 1500]
      }
    },
    monthly: {
      labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
      sales: [85000, 92000, 88000, 95000],
      expenses: {
        personel: [37000, 37000, 37000, 37000],
        kira: [7000, 7000, 7000, 7000],
        utilities: [5500, 5800, 5600, 5900],
        stock: [45000, 48000, 46000, 49000],
        other: [8500, 9000, 8800, 9200]
      }
    },
    yearly: {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      sales: [320000, 335000, 340000, 360000, 380000, 400000],
      expenses: {
        personel: [150000, 150000, 150000, 160000, 160000, 160000],
        kira: [28000, 28000, 28000, 28000, 28000, 28000],
        utilities: [22000, 23000, 22500, 23500, 24000, 24500],
        stock: [180000, 185000, 188000, 195000, 200000, 210000],
        other: [35000, 36000, 36500, 37000, 38000, 39000]
      }
    }
  };

  // Toplam giderleri hesapla
  const calculateTotalExpenses = (expenses) => {
    return Object.values(expenses).reduce((acc, curr) => {
      return acc.map((num, idx) => num + curr[idx]);
    }, new Array(expenses.personel.length).fill(0));
  };

  // Net kârı hesapla
  const calculateProfit = (sales, expenses) => {
    const totalExpenses = calculateTotalExpenses(expenses);
    return sales.map((sale, idx) => sale - totalExpenses[idx]);
  };

  // Seçilen periyot için verileri hazırla
  const periodData = financialData[dateRange];
  const totalExpenses = calculateTotalExpenses(periodData.expenses);
  const profit = calculateProfit(periodData.sales, periodData.expenses);

  // İstatistikleri hesapla
  const calculateStats = () => {
    const totalSales = periodData.sales.reduce((a, b) => a + b, 0);
    const totalExp = totalExpenses.reduce((a, b) => a + b, 0);
    const totalProfit = profit.reduce((a, b) => a + b, 0);
    const profitMargin = ((totalProfit / totalSales) * 100).toFixed(1);

    return {
      sales: {
        total: totalSales,
        average: totalSales / periodData.sales.length,
        max: Math.max(...periodData.sales)
      },
      expenses: {
        total: totalExp,
        average: totalExp / totalExpenses.length,
        breakdown: {
          personel: periodData.expenses.personel.reduce((a, b) => a + b, 0),
          kira: periodData.expenses.kira.reduce((a, b) => a + b, 0),
          utilities: periodData.expenses.utilities.reduce((a, b) => a + b, 0),
          stock: periodData.expenses.stock.reduce((a, b) => a + b, 0),
          other: periodData.expenses.other.reduce((a, b) => a + b, 0)
        }
      },
      profit: {
        total: totalProfit,
        margin: profitMargin,
        average: totalProfit / profit.length
      }
    };
  };

  const stats = calculateStats();

  // Grafik verilerini hazırla
  const chartData = {
    labels: periodData.labels,
    datasets: [
      {
        label: 'Satışlar',
        data: periodData.sales,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2
      },
      {
        label: 'Giderler',
        data: totalExpenses,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2
      },
      {
        label: 'Net Kâr',
        data: profit,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Finansal Rapor`,
        font: { size: 18, weight: 'bold' }
      }
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

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-top">
          <h2>Finansal Raporlar</h2>
          <div className="period-selector">
            <button 
              className={`control-btn ${dateRange === 'weekly' ? 'active' : ''}`}
              onClick={() => setDateRange('weekly')}
            >
              Haftalık
            </button>
            <button 
              className={`control-btn ${dateRange === 'monthly' ? 'active' : ''}`}
              onClick={() => setDateRange('monthly')}
            >
              Aylık
            </button>
            <button 
              className={`control-btn ${dateRange === 'yearly' ? 'active' : ''}`}
              onClick={() => setDateRange('yearly')}
            >
              Yıllık
            </button>
          </div>
        </div>
      </div>

      <div className="report-content">
        <div className="financial-summary">
          <div className="summary-card sales">
            <div className="card-header">
              <i className="fas fa-chart-line"></i>
              <h3>Satışlar</h3>
            </div>
            <div className="card-content">
              <div className="main-stat">₺{stats.sales.total.toLocaleString()}</div>
              <div className="sub-stats">
                <div className="sub-stat">
                  <span>Ortalama</span>
                  <span>₺{Math.round(stats.sales.average).toLocaleString()}</span>
                </div>
                <div className="sub-stat">
                  <span>En Yüksek</span>
                  <span>₺{stats.sales.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card expenses">
            <div className="card-header">
              <i className="fas fa-wallet"></i>
              <h3>Giderler</h3>
            </div>
            <div className="card-content">
              <div className="main-stat">₺{stats.expenses.total.toLocaleString()}</div>
              <div className="expense-breakdown">
                <div className="breakdown-item">
                  <span>Personel</span>
                  <span>₺{stats.expenses.breakdown.personel.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span>Kira</span>
                  <span>₺{stats.expenses.breakdown.kira.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span>Utilities</span>
                  <span>₺{stats.expenses.breakdown.utilities.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span>Stok</span>
                  <span>₺{stats.expenses.breakdown.stock.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card profit">
            <div className="card-header">
              <i className="fas fa-coins"></i>
              <h3>Kârlılık</h3>
            </div>
            <div className="card-content">
              <div className="main-stat">₺{stats.profit.total.toLocaleString()}</div>
              <div className="sub-stats">
                <div className="sub-stat">
                  <span>Kâr Marjı</span>
                  <span>%{stats.profit.margin}</span>
                </div>
                <div className="sub-stat">
                  <span>Ort. Kâr</span>
                  <span>₺{Math.round(stats.profit.average).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <Bar options={options} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;


