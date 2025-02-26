import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../screens_css/companies.css';

const Companies = () => {
  const [activeTab, setActiveTab] = useState('companies'); // companies veya individual

  // Şirket listesi için state ekleyelim
  const [companies, setCompanies] = useState([]);

  // Örnek şirket verilerini kaldıralım
  // const [companies] = useState([{ ... }]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: ''
  });

  const [newCompany, setNewCompany] = useState({
    name: '',
    taxNumber: '',
    taxOffice: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    creditLimit: 0,
    riskStatus: 'LOW'
  });

  // Müşteri listesi için state
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Yeni state ekleyelim
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Şirketleri getirme fonksiyonu ekleyelim
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/companies');
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      setError('Firmalar yüklenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Müşterileri getir
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/customers');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Müşteriler yüklenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook'unu güncelleyelim
  useEffect(() => {
    if (activeTab === 'individual') {
      fetchCustomers();
    } else {
      fetchCompanies();
    }
  }, [activeTab]);

  // Arama fonksiyonunu güncelleyelim
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Arama terimi boşsa tüm listeyi getir
      if (activeTab === 'individual') {
        fetchCustomers();
      } else {
        fetchCompanies();
      }
      return;
    }

    try {
      setLoading(true);
      if (activeTab === 'individual') {
        // Müşteri araması
        const response = await axios.get(`http://localhost:8081/api/customers/search?query=${searchTerm}`);
        setCustomers(response.data);
      } else {
        // Firma araması
        const response = await axios.get(`http://localhost:8081/api/companies/search?query=${searchTerm}`);
        setCompanies(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Arama yapılırken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Yeni müşteri ekleme
  const handleAddCustomer = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8081/api/customers', newCustomer);
      
      // Formu temizle ve modalı kapat
      setNewCustomer({
        name: '',
        surname: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: ''
      });
      setShowAddModal(false);
      
      // Müşteri listesini güncelle
      fetchCustomers();
      setError(null);
    } catch (err) {
      setError('Müşteri eklenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Müşteri silme
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8081/api/customers/${id}`);
      fetchCustomers();
      setError(null);
    } catch (err) {
      setError('Müşteri silinirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8081/api/companies', newCompany);
      
      // Formu temizle ve modalı kapat
      setNewCompany({
        name: '',
        taxNumber: '',
        taxOffice: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        creditLimit: 0,
        riskStatus: 'LOW'
      });
      setShowAddModal(false);
      
      // Firma listesini güncelle
      fetchCompanies();
      setError(null);
    } catch (err) {
      setError('Firma eklenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Firma silme fonksiyonu ekle
  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Bu firmayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8081/api/companies/${id}`);
      fetchCompanies();
      setError(null);
    } catch (err) {
      setError('Firma silinirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Firma düzenleme için state'ler ekle
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);

  // Firma düzenleme modalını açma fonksiyonu
  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowEditCompanyModal(true);
  };

  // Firma güncelleme fonksiyonu
  const handleUpdateCompany = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/companies/${editingCompany.id}`, editingCompany);
      
      setShowEditCompanyModal(false);
      setEditingCompany(null);
      fetchCompanies();
      setError(null);
    } catch (err) {
      setError('Firma güncellenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Müşteri detaylarını görüntüleme fonksiyonu
  const handleViewDetails = (customer) => {
    // Şimdilik sadece konsola yazdıralım
    console.log('Müşteri detayları:', customer);
    
    // İleride burada detay sayfasına yönlendirme yapılabilir
    // veya detay modalı açılabilir
    // history.push(`/customers/${customer.id}`);
    // veya
    // setShowDetailsModal(true);
    // setSelectedCustomer(customer);
  };

  // Müşteri düzenleme modalını açma fonksiyonu
  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  // Müşteri güncelleme fonksiyonu
  const handleUpdateCustomer = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/customers/${editingCustomer.id}`, editingCustomer);
      
      setShowEditModal(false);
      setEditingCustomer(null);
      fetchCustomers(); // Listeyi yenile
      setError(null);
    } catch (err) {
      setError('Müşteri güncellenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

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
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button 
              className="search-button"
              onClick={handleSearch}
            >
              Ara
            </button>
          </div>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i>
          {activeTab === 'companies' ? 'Yeni Firma' : 'Yeni Müşteri'}
        </button>
      </div>

      {/* Hata ve Yükleniyor durumlarını göster */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          Yükleniyor...
        </div>
      ) : (
        <>
          {/* Firma Listesi */}
          {activeTab === 'companies' && (
            <div className="table-container">
              {!companies || companies.length === 0 ? (
                <div className="no-data">Firma bulunamadı</div>
              ) : (
                <table className="companies-table">
                  <thead>
                    <tr>
                      <th>Firma Adı</th>
                      <th>Vergi No</th>
                      <th>Telefon</th>
                      <th>Email</th>
                      <th>Şehir</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(company => (
                      <tr key={company.id}>
                        <td>{company.name}</td>
                        <td>{company.taxNumber}</td>
                        <td>{company.phone}</td>
                        <td>{company.email}</td>
                        <td>{company.city}</td>
                        <td className="actions-cell">
                          <button 
                            title="Düzenle" 
                            onClick={() => handleEditCompany(company)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            title="İncele"
                            onClick={() => handleViewDetails(company)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            title="Sil" 
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Müşteri Listesi */}
          {activeTab === 'individual' && (
            <div className="individuals-grid">
              {customers && customers.map(customer => (
                <div key={customer.id} className="individual-card">
                  <div className="individual-header">
                    <h3>{customer.name} {customer.surname}</h3>
                    <span className="status active">Aktif</span>
                  </div>

                  <div className="individual-info">
                    <div className="info-group">
                      <label>İletişim</label>
                      <div className="contact-details">
                        {customer.email && <p><i className="fas fa-envelope"></i> {customer.email}</p>}
                        {customer.phone && <p><i className="fas fa-phone"></i> {customer.phone}</p>}
                      </div>
                    </div>
                    
                    {customer.address && (
                      <div className="info-group">
                        <label>Adres</label>
                        <p>
                          {customer.address}
                          {(customer.district || customer.city) && (
                            <span>
                              {customer.district && `, ${customer.district}`}
                              {customer.city && `, ${customer.city}`}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      title="Düzenle" 
                      onClick={() => handleEditClick(customer)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      title="İncele"
                      onClick={() => handleViewDetails(customer)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      title="Sil" 
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Müşteri Ekleme Modalı */}
      {showAddModal && activeTab === 'individual' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Müşteri Ekle</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad*</label>
                  <input 
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad*</label>
                  <input 
                    type="text"
                    value={newCustomer.surname}
                    onChange={(e) => setNewCustomer({...newCustomer, surname: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefon</label>
                  <input 
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="0555 555 5555"
                  />
                </div>
                <div className="form-group">
                  <label>E-posta</label>
                  <input 
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Adres</label>
                <textarea 
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>İl</label>
                  <input 
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>İlçe</label>
                  <input 
                    type="text"
                    value={newCustomer.district}
                    onChange={(e) => setNewCustomer({...newCustomer, district: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleAddCustomer}
                disabled={!newCustomer.name || !newCustomer.surname}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firma Ekleme Modalı */}
      {showAddModal && activeTab === 'companies' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Firma Ekle</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-section">
                <h4>Firma Bilgileri</h4>
                <div className="form-group">
                  <label>Firma Adı*</label>
                  <input 
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vergi Numarası</label>
                    <input 
                      type="text"
                      value={newCompany.taxNumber}
                      onChange={(e) => setNewCompany({...newCompany, taxNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Vergi Dairesi</label>
                    <input 
                      type="text"
                      value={newCompany.taxOffice}
                      onChange={(e) => setNewCompany({...newCompany, taxOffice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>İletişim Bilgileri</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefon</label>
                    <input 
                      type="tel"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                      placeholder="0212 555 5555"
                    />
                  </div>
                  <div className="form-group">
                    <label>E-posta</label>
                    <input 
                      type="email"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Adres Bilgileri</h4>
                <div className="form-group">
                  <label>Adres</label>
                  <textarea 
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>İl</label>
                    <input 
                      type="text"
                      value={newCompany.city}
                      onChange={(e) => setNewCompany({...newCompany, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>İlçe</label>
                    <input 
                      type="text"
                      value={newCompany.district}
                      onChange={(e) => setNewCompany({...newCompany, district: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Finansal Bilgiler</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kredi Limiti</label>
                    <input 
                      type="number"
                      value={newCompany.creditLimit}
                      onChange={(e) => setNewCompany({...newCompany, creditLimit: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Risk Durumu</label>
                    <select
                      value={newCompany.riskStatus}
                      onChange={(e) => setNewCompany({...newCompany, riskStatus: e.target.value})}
                    >
                      <option value="LOW">Düşük</option>
                      <option value="MEDIUM">Orta</option>
                      <option value="HIGH">Yüksek</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleAddCompany}
                disabled={!newCompany.name}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Modalı */}
      {showEditModal && editingCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Müşteri Düzenle</h3>
              <button onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad*</label>
                  <input 
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      name: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad*</label>
                  <input 
                    type="text"
                    value={editingCustomer.surname}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      surname: e.target.value
                    })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefon</label>
                  <input 
                    type="tel"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      phone: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>E-posta</label>
                  <input 
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      email: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Adres</label>
                <textarea 
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    address: e.target.value
                  })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>İl</label>
                  <input 
                    type="text"
                    value={editingCustomer.city}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      city: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>İlçe</label>
                  <input 
                    type="text"
                    value={editingCustomer.district}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      district: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleUpdateCustomer}
                disabled={!editingCustomer.name || !editingCustomer.surname}
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firma Düzenleme Modalı */}
      {showEditCompanyModal && editingCompany && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Firma Düzenle</h3>
              <button onClick={() => setShowEditCompanyModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-section">
                <h4>Firma Bilgileri</h4>
                <div className="form-group">
                  <label>Firma Adı*</label>
                  <input 
                    type="text"
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vergi Numarası</label>
                    <input 
                      type="text"
                      value={editingCompany.taxNumber}
                      onChange={(e) => setEditingCompany({...editingCompany, taxNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Vergi Dairesi</label>
                    <input 
                      type="text"
                      value={editingCompany.taxOffice}
                      onChange={(e) => setEditingCompany({...editingCompany, taxOffice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>İletişim Bilgileri</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefon</label>
                    <input 
                      type="tel"
                      value={editingCompany.phone}
                      onChange={(e) => setEditingCompany({...editingCompany, phone: e.target.value})}
                      placeholder="0212 555 5555"
                    />
                  </div>
                  <div className="form-group">
                    <label>E-posta</label>
                    <input 
                      type="email"
                      value={editingCompany.email}
                      onChange={(e) => setEditingCompany({...editingCompany, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Adres Bilgileri</h4>
                <div className="form-group">
                  <label>Adres</label>
                  <textarea 
                    value={editingCompany.address}
                    onChange={(e) => setEditingCompany({...editingCompany, address: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>İl</label>
                    <input 
                      type="text"
                      value={editingCompany.city}
                      onChange={(e) => setEditingCompany({...editingCompany, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>İlçe</label>
                    <input 
                      type="text"
                      value={editingCompany.district}
                      onChange={(e) => setEditingCompany({...editingCompany, district: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Finansal Bilgiler</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kredi Limiti</label>
                    <input 
                      type="number"
                      value={editingCompany.creditLimit}
                      onChange={(e) => setEditingCompany({...editingCompany, creditLimit: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Risk Durumu</label>
                    <select
                      value={editingCompany.riskStatus}
                      onChange={(e) => setEditingCompany({...editingCompany, riskStatus: e.target.value})}
                    >
                      <option value="LOW">Düşük</option>
                      <option value="MEDIUM">Orta</option>
                      <option value="HIGH">Yüksek</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditCompanyModal(false)}>
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleUpdateCompany}
                disabled={!editingCompany.name}
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;


