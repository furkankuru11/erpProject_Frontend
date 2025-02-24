import React, { useState } from 'react';
import '../screens_css/customers.css';

const Customers = () => {
  const [activeTab, setActiveTab] = useState('customers'); // customers veya companies

  // Örnek müşteri verileri
  const [customers] = useState([
    { 
      id: 1,
      name: 'Mehmet Demir',
      email: 'mehmet@email.com',
      phone: '0533 444 5566',
      address: 'Ankara, Türkiye',
      totalOrders: 8,
      lastOrder: '2024-03-15',
      totalSpent: 15000,
      status: 'active'
    },
    // ... diğer müşteriler
  ]);

  // Örnek şirket verileri
  const [companies] = useState([
    {
      id: 1,
      name: 'ABC Şirketi',
      taxNumber: '1234567890',
      contact: 'Ahmet Yılmaz',
      email: 'info@abcshop.com',
      phone: '0212 555 1234',
      address: 'İstanbul, Türkiye',
      totalOrders: 25,
      lastOrder: '2024-03-20',
      totalRevenue: 125000,
      status: 'active',
      paymentTerms: '30 gün',
      creditLimit: 50000
    },
    // ... diğer şirketler
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="customers-container">
      <div className="page-header">
        <div className="header-tabs">
          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <i className="fas fa-user"></i>
            Bireysel Müşteriler
          </button>
          <button 
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            <i className="fas fa-building"></i>
            Kurumsal Müşteriler
          </button>
        </div>
        <button className="add-btn">
          <i className="fas fa-plus"></i>
          {activeTab === 'customers' ? 'Yeni Müşteri' : 'Yeni Şirket'}
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder={activeTab === 'customers' ? 'Müşteri ara...' : 'Şirket ara...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="quick-filters">
          <button className="active">Tümü</button>
          <button>Aktif</button>
          <button>Pasif</button>
          {activeTab === 'companies' && <button>Limitli</button>}
        </div>
      </div>

      {activeTab === 'customers' ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Müşteri Adı</th>
                <th>İletişim</th>
                <th>Son Sipariş</th>
                <th>Toplam Sipariş</th>
                <th>Toplam Harcama</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td className="name-cell">
                    <div className="name-info">
                      <span className="name">{customer.name}</span>
                      <span className="email">{customer.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{customer.phone}</div>
                      <div className="address">{customer.address}</div>
                    </div>
                  </td>
                  <td>{new Date(customer.lastOrder).toLocaleDateString('tr-TR')}</td>
                  <td>{customer.totalOrders}</td>
                  <td>₺{customer.totalSpent.toLocaleString()}</td>
                  <td>
                    <span className={`status ${customer.status}`}>
                      {customer.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Şirket Bilgileri</th>
                <th>İletişim</th>
                <th>Finansal Bilgiler</th>
                <th>Son Sipariş</th>
                <th>Toplam Sipariş</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td className="company-cell">
                    <div className="company-info">
                      <span className="name">{company.name}</span>
                      <span className="tax-number">Vergi No: {company.taxNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-person">{company.contact}</div>
                      <div>{company.phone}</div>
                      <div className="email">{company.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="financial-info">
                      <div>Kredi Limiti: ₺{company.creditLimit.toLocaleString()}</div>
                      <div>Vade: {company.paymentTerms}</div>
                    </div>
                  </td>
                  <td>{new Date(company.lastOrder).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <div className="order-info">
                      <div>{company.totalOrders} Sipariş</div>
                      <div className="revenue">₺{company.totalRevenue.toLocaleString()}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${company.status}`}>
                      {company.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers; 