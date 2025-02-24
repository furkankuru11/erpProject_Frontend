import React, { useState } from 'react';
import '../screens_css/user_management.css';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users'); // users, customers veya companies

  // Örnek kullanıcı verileri
  const [users] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      lastLogin: '2024-03-20',
      status: 'active'
    },
    {
      id: 2,
      name: 'Staff User',
      email: 'staff@example.com',
      role: 'staff',
      lastLogin: '2024-03-19',
      status: 'active'
    }
  ]);

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
    }
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
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="user-management-container">
      <div className="page-header">
        <div className="header-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users-cog"></i>
            Sistem Kullanıcıları
          </button>
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
          {activeTab === 'users' ? 'Yeni Kullanıcı' : 
           activeTab === 'customers' ? 'Yeni Müşteri' : 'Yeni Şirket'}
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder={
              activeTab === 'users' ? 'Kullanıcı ara...' :
              activeTab === 'customers' ? 'Müşteri ara...' : 'Şirket ara...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="quick-filters">
          <button className="active">Tümü</button>
          <button>Aktif</button>
          <button>Pasif</button>
          {activeTab === 'users' && <button>Yöneticiler</button>}
          {activeTab === 'companies' && <button>Limitli</button>}
        </div>
      </div>

      <div className="table-container">
        {activeTab === 'users' && (
          <table>
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Rol</th>
                <th>Son Giriş</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <span className="name">{user.name}</span>
                      <span className="email">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Yönetici' : 'Personel'}
                    </span>
                  </td>
                  <td>{new Date(user.lastLogin).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button title="Düzenle">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button title="Yetkilendirme">
                        <i className="fas fa-key"></i>
                      </button>
                      <button title="Sil">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'customers' && (
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
        )}

        {activeTab === 'companies' && (
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
        )}
      </div>
    </div>
  );
};

export default UserManagement; 