import React, { useState } from 'react';
import '../screens_css/companies.css';

const Companies = () => {
  const [activeTab, setActiveTab] = useState('companies'); // companies veya individual

  // Örnek şirket verileri
  const [companies] = useState([
    {
      id: 1,
      name: 'ABC Teknoloji Ltd.',
      type: 'technology',
      taxNumber: '1234567890',
      contact: {
        name: 'Ahmet Yılmaz',
        position: 'Satın Alma Müdürü',
        email: 'ahmet@abctech.com',
        phone: '0212 555 1234'
      },
      address: {
        street: 'Teknoloji Caddesi No:1',
        district: 'Maslak',
        city: 'İstanbul'
      },
      financials: {
        creditLimit: 100000,
        currentDebt: 35000,
        paymentTerms: '30 gün',
        riskStatus: 'low'
      },
      stats: {
        totalOrders: 45,
        lastOrder: '2024-03-20',
        totalRevenue: 450000
      },
      status: 'active'
    }
  ]);

  // Örnek bireysel müşteri verileri
  const [individuals] = useState([
    {
      id: 1,
      name: 'Mehmet Demir',
      email: 'mehmet@email.com',
      phone: '0533 444 5566',
      address: {
        street: 'Çiçek Sokak No:5',
        district: 'Kadıköy',
        city: 'İstanbul'
      },
      stats: {
        totalOrders: 8,
        lastOrder: '2024-03-15',
        totalSpent: 15000
      },
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="companies-container">
      {/* Üst Sekmeler */}
      <div className="tabs-section">
        <button 
          className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <i className="fas fa-building"></i>
          Kurumsal Müşteriler
        </button>
        <button 
          className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <i className="fas fa-user"></i>
          Bireysel Müşteriler
        </button>
      </div>

      {/* Arama ve Kontroller */}
      <div className="controls-section">
        <div className="left-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder={activeTab === 'companies' ? "Firma ara..." : "Müşteri ara..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
         
        </div>
        <button className="add-btn">
          <i className="fas fa-plus"></i>
          {activeTab === 'companies' ? 'Yeni Firma Ekle' : 'Yeni Müşteri Ekle'}
        </button>
      </div>

      {/* Kurumsal Müşteriler */}
      {activeTab === 'companies' && (
        <div className="companies-grid">
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <h3>{company.name}</h3>
                <span className={`status-badge ${company.status}`}>
                  {company.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              
              <div className="company-info">
                <div className="info-group">
                  <label>Vergi No</label>
                  <span>{company.taxNumber}</span>
                </div>
                <div className="info-group">
                  <label>İletişim</label>
                  <div className="contact-details">
                    <p>{company.contact.name} ({company.contact.position})</p>
                    <p>{company.contact.email}</p>
                    <p>{company.contact.phone}</p>
                  </div>
                </div>
                <div className="info-group">
                  <label>Adres</label>
                  <p>{company.address.street}</p>
                  <p>{company.address.district}, {company.address.city}</p>
                </div>
              </div>

              <div className="financial-section">
                <div className="financial-row">
                  <div className="financial-item">
                    <label>Kredi Limiti</label>
                    <span>₺{company.financials.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="financial-item">
                    <label>Mevcut Borç</label>
                    <span>₺{company.financials.currentDebt.toLocaleString()}</span>
                  </div>
                </div>
                <div className="financial-row">
                  <div className="financial-item">
                    <label>Vade</label>
                    <span>{company.financials.paymentTerms}</span>
                  </div>
                  <div className="financial-item">
                    <label>Risk Durumu</label>
                    <span className={`risk-badge ${company.financials.riskStatus}`}>
                      {company.financials.riskStatus === 'low' ? 'Düşük' :
                       company.financials.riskStatus === 'medium' ? 'Orta' : 'Yüksek'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <div className="stat-item">
                  <i className="fas fa-shopping-cart"></i>
                  <div>
                    <label>Toplam Sipariş</label>
                    <span>{company.stats.totalOrders}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-calendar"></i>
                  <div>
                    <label>Son Sipariş</label>
                    <span>{new Date(company.stats.lastOrder).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-chart-bar"></i>
                  <div>
                    <label>Toplam Gelir</label>
                    <span>₺{company.stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button title="Düzenle">
                  <i className="fas fa-edit"></i>
                </button>
                <button title="Siparişler">
                  <i className="fas fa-shopping-cart"></i>
                </button>
                <button title="Ödemeler">
                  <i className="fas fa-money-bill-wave"></i>
                </button>
                <button title="Detaylar">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bireysel Müşteriler */}
      {activeTab === 'individual' && (
        <div className="individuals-grid">
          {individuals.map(individual => (
            <div key={individual.id} className="individual-card">
              <div className="individual-header">
                <h3>{individual.name}</h3>
                <span className={`status-badge ${individual.status}`}>
                  {individual.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="individual-info">
                <div className="info-group">
                  <label>İletişim</label>
                  <div className="contact-details">
                    <p>{individual.email}</p>
                    <p>{individual.phone}</p>
                  </div>
                </div>
                <div className="info-group">
                  <label>Adres</label>
                  <p>{individual.address.street}</p>
                  <p>{individual.address.district}, {individual.address.city}</p>
                </div>
              </div>

              <div className="stats-section">
                <div className="stat-item">
                  <i className="fas fa-shopping-cart"></i>
                  <div>
                    <label>Toplam Sipariş</label>
                    <span>{individual.stats.totalOrders}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-calendar"></i>
                  <div>
                    <label>Son Sipariş</label>
                    <span>{new Date(individual.stats.lastOrder).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-wallet"></i>
                  <div>
                    <label>Toplam Harcama</label>
                    <span>₺{individual.stats.totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button title="Düzenle">
                  <i className="fas fa-edit"></i>
                </button>
                <button title="Siparişler">
                  <i className="fas fa-shopping-cart"></i>
                </button>
                <button title="Detaylar">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;


