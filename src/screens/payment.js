import React, { useState } from 'react';
import '../screens_css/payment.css';

const Payment = () => {
  const [activeTab, setActiveTab] = useState('methods'); // methods, transactions, settings

  // Örnek ödeme yöntemleri
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      name: 'Kredi Kartı',
      icon: 'fa-credit-card',
      isActive: true,
      commission: 1.95,
      installments: [
        { count: 1, commission: 0 },
        { count: 3, commission: 2.95 },
        { count: 6, commission: 4.95 }
      ]
    },
    {
      id: 2,
      type: 'bank_transfer',
      name: 'Havale/EFT',
      icon: 'fa-university',
      isActive: true,
      commission: 0,
      banks: [
        { name: 'Ziraat Bankası', iban: 'TR00 0000 0000 0000' },
        { name: 'İş Bankası', iban: 'TR00 0000 0000 0000' }
      ]
    },
    {
      id: 3,
      type: 'cash',
      name: 'Nakit Ödeme',
      icon: 'fa-money-bill-wave',
      isActive: true,
      commission: 0
    }
  ]);

  // Örnek son işlemler
  const [recentTransactions] = useState([
    {
      id: 1,
      date: '2024-03-20',
      amount: 1500,
      method: 'credit_card',
      status: 'success',
      customer: 'Ahmet Yılmaz',
      description: 'Sipariş #1234'
    },
    {
      id: 2,
      date: '2024-03-19',
      amount: 2750,
      method: 'bank_transfer',
      status: 'pending',
      customer: 'Mehmet Demir',
      description: 'Sipariş #1235'
    }
  ]);

  return (
    <div className="payment-container">
      {/* Üst Sekmeler */}
      <div className="payment-tabs">
        <button 
          className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          <i className="fas fa-wallet"></i>
          Ödeme Yöntemleri
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <i className="fas fa-exchange-alt"></i>
          Son İşlemler
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i>
          Ayarlar
        </button>
      </div>

      {/* Ödeme Yöntemleri */}
      {activeTab === 'methods' && (
        <div className="methods-grid">
          {paymentMethods.map(method => (
            <div key={method.id} className="method-card">
              <div className="method-header">
                <div className="method-icon">
                  <i className={`fas ${method.icon}`}></i>
                </div>
                <div className="method-info">
                  <h3>{method.name}</h3>
                  <span className={`status-badge ${method.isActive ? 'active' : 'inactive'}`}>
                    {method.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <div className="method-actions">
                  <button className="toggle-btn">
                    <i className={`fas fa-toggle-${method.isActive ? 'on' : 'off'}`}></i>
                  </button>
                  <button className="edit-btn">
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>

              <div className="method-details">
                {method.type === 'credit_card' && (
                  <div className="installments-table">
                    <h4>Taksit Seçenekleri</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Taksit</th>
                          <th>Komisyon</th>
                          <th>Toplam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {method.installments.map(inst => (
                          <tr key={inst.count}>
                            <td>{inst.count} Taksit</td>
                            <td>%{inst.commission}</td>
                            <td>₺{(100 * (1 + inst.commission / 100)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {method.type === 'bank_transfer' && (
                  <div className="bank-accounts">
                    <h4>Banka Hesapları</h4>
                    {method.banks.map((bank, index) => (
                      <div key={index} className="bank-account">
                        <div className="bank-name">{bank.name}</div>
                        <div className="bank-iban">
                          <span>{bank.iban}</span>
                          <button title="Kopyala">
                            <i className="fas fa-copy"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {method.commission > 0 && (
                  <div className="commission-info">
                    <i className="fas fa-info-circle"></i>
                    <span>Bu ödeme yöntemi için %{method.commission} işlem ücreti uygulanır.</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Son İşlemler */}
      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <div className="transactions-header">
            <h2>Son İşlemler</h2>
            <div className="transaction-filters">
              <select>
                <option value="all">Tüm İşlemler</option>
                <option value="success">Başarılı</option>
                <option value="pending">Beklemede</option>
                <option value="failed">Başarısız</option>
              </select>
              <input type="date" />
            </div>
          </div>

          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Müşteri</th>
                  <th>Tutar</th>
                  <th>Yöntem</th>
                  <th>Durum</th>
                  <th>Açıklama</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                    <td>{transaction.customer}</td>
                    <td>₺{transaction.amount.toLocaleString()}</td>
                    <td>
                      <span className="payment-method">
                        <i className={`fas ${
                          transaction.method === 'credit_card' ? 'fa-credit-card' :
                          transaction.method === 'bank_transfer' ? 'fa-university' : 'fa-money-bill-wave'
                        }`}></i>
                        {
                          transaction.method === 'credit_card' ? 'Kredi Kartı' :
                          transaction.method === 'bank_transfer' ? 'Havale/EFT' : 'Nakit'
                        }
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {
                          transaction.status === 'success' ? 'Başarılı' :
                          transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'
                        }
                      </span>
                    </td>
                    <td>{transaction.description}</td>
                    <td>
                      <div className="action-buttons">
                        <button title="Detaylar">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button title="Yazdır">
                          <i className="fas fa-print"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ayarlar */}
      {activeTab === 'settings' && (
        <div className="settings-section">
          <div className="settings-card">
            <h3>Genel Ayarlar</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Varsayılan Para Birimi</label>
                <select>
                  <option value="TRY">TRY - Türk Lirası</option>
                  <option value="USD">USD - Amerikan Doları</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Otomatik İşlem Onayı</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="autoApprove" />
                  <label htmlFor="autoApprove"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3>Bildirim Ayarları</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>E-posta Bildirimleri</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="emailNotif" />
                  <label htmlFor="emailNotif"></label>
                </div>
              </div>
              <div className="form-group">
                <label>SMS Bildirimleri</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="smsNotif" />
                  <label htmlFor="smsNotif"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
