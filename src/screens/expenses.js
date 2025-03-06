import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api';

// Enum değerleri
const ExpenseCategory = {
  PERSONNEL: 'Personel',
  RENT: 'Kira',
  BILL: 'Fatura',
  OTHER: 'Diğer'
};

const ExpenseStatus = {
  PENDING: 'Beklemede',
  PAID: 'Ödendi'
};

// Kategori seçenekleri
const categoryOptions = [
  { value: ExpenseCategory.PERSONNEL, label: 'Personel' },

  { value: ExpenseCategory.RENT, label: 'Kira' },

  { value: ExpenseCategory.OTHER, label: 'Diğer' }
];

// Durum seçenekleri
const statusOptions = [
  { value: 'all', label: 'Tümü' },
  { value: ExpenseStatus.PENDING, label: 'Beklemede' },
  { value: ExpenseStatus.PAID, label: 'Ödendi' }
];

// JWT token'ı localStorage'dan al
const getAuthToken = () => localStorage.getItem('token');

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor ekle
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gider ekleme fonksiyonu
const addExpense = async (expenseData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(expenseData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const ExpenseManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  // State'i backend yapısına uygun olarak güncelle
  const [newExpense, setNewExpense] = useState({
    categories: '',
    description: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    status: ExpenseStatus.PENDING
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Giderleri getir - useCallback ile memoize et
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/expenses');
      if (!response.data) {
        throw new Error('Veri alınamadı');
      }
      setExpenses(response.data);
    } catch (error) {
      console.error('Giderler yüklenirken hata:', error);
      let errorMessage = 'Giderler yüklenirken bir hata oluştu.';
      
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Yeni gider ekle
  const handleAddExpense = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      if (!newExpense.categories || !newExpense.description || !newExpense.price || !newExpense.date) {
        setError('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      // Backend'e gönderilecek veriyi hazırla
      const expenseData = {
        categories: newExpense.categories,
        description: newExpense.description,
        price: parseFloat(newExpense.price).toFixed(2), // BigDecimal için string formatında gönder
        date: newExpense.date,
        status: newExpense.status
      };

      setLoading(true);
      const result = await addExpense(expenseData);
      
      setShowAddModal(false);
      setNewExpense({
        categories: '',
        description: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        status: ExpenseStatus.PENDING
      });
      setError(null);
      await fetchExpenses();
      alert('Gider başarıyla eklendi!');
      console.log('Eklenen gider:', result);

    } catch (error) {
      console.error('Gider eklenirken hata:', error);
      let errorMessage = 'Gider eklenirken bir hata oluştu.';
      
      if (error.message.includes('401')) {
        navigate('/login');
        return;
      } else if (error.message.includes('403')) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : Object.values(error.response.data).join('\n');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Gider silme fonksiyonu
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/expenses/${expenseId}`);
      await fetchExpenses();
      alert('Gider başarıyla silindi.');
    } catch (error) {
      console.error('Gider silinirken hata:', error);
      let errorMessage = 'Gider silinirken bir hata oluştu.';
      
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Gider düzenleme fonksiyonu
  const handleEditExpense = async () => {
    try {
      if (!selectedExpense) return;

      const expenseData = {
        ...selectedExpense,
        price: parseFloat(selectedExpense.price).toFixed(2)
      };

      setLoading(true);
      await api.put(`/expenses/${selectedExpense.id}`, expenseData);
      setShowEditModal(false);
      await fetchExpenses();
      alert('Gider başarıyla güncellendi.');
    } catch (error) {
      console.error('Gider güncellenirken hata:', error);
      let errorMessage = 'Gider güncellenirken bir hata oluştu.';
      
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Düzenleme modalını aç
  const openEditModal = (expense) => {
    setSelectedExpense({
      ...expense,
      price: Number(expense.price).toString()
    });
    setShowEditModal(true);
  };

  // Component mount olduğunda ve navigate değiştiğinde çalış
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenses();
  }, [navigate, fetchExpenses]);

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Gider Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Yeni Gider
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="card-content">
            <h3>Toplam Gider</h3>
            <p className="card-value">{expenses.length}</p>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="card-content">
            <h3>Bekleyen Ödemeler</h3>
            <p className="card-value">{expenses.filter(e => e.status === ExpenseStatus.PENDING).length}</p>
          </div>
        </div>

        <div className="summary-card amount">
          <div className="card-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="card-content">
            <h3>Toplam Tutar</h3>
            <p className="card-value">₺{expenses.reduce((sum, expense) => sum + Number(expense.price), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="filter-section">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Gider ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={fetchExpenses} className="retry-button">
            <i className="fas fa-sync"></i> Yeniden Dene
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th>Tutar</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .filter(expense => filterStatus === 'all' || expense.status === filterStatus)
                .filter(expense => 
                  expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  categoryOptions.find(cat => cat.value === expense.categories)?.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(expense => (
                  <tr key={expense.id}>
                    <td>
                      <span className="category-badge">
                        {categoryOptions.find(cat => cat.value === expense.categories)?.label}
                      </span>
                    </td>
                    <td>{expense.description}</td>
                    <td className="amount">₺{Number(expense.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td>{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`status-badge ${expense.status.toLowerCase()}`}>
                        {statusOptions.find(opt => opt.value === expense.status)?.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="icon-button edit" 
                          title="Düzenle"
                          onClick={() => openEditModal(expense)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="icon-button delete" 
                          title="Sil"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Gider Düzenle</h3>
              <button onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Kategori</label>
                <select 
                  value={selectedExpense.categories} 
                  onChange={(e) => setSelectedExpense({...selectedExpense, categories: e.target.value})}
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <input 
                  type="text"
                  value={selectedExpense.description}
                  onChange={(e) => setSelectedExpense({...selectedExpense, description: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tutar</label>
                  <div className="input-with-icon">
                    <span className="currency-symbol">₺</span>
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={selectedExpense.price}
                      onChange={(e) => setSelectedExpense({...selectedExpense, price: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tarih</label>
                  <input 
                    type="date"
                    value={selectedExpense.date}
                    onChange={(e) => setSelectedExpense({...selectedExpense, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Durum</label>
                <select 
                  value={selectedExpense.status}
                  onChange={(e) => setSelectedExpense({...selectedExpense, status: e.target.value})}
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowEditModal(false)}
              >
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleEditExpense}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </span>
                ) : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Gider Ekle</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Kategori</label>
                <select 
                  value={newExpense.categories} 
                  onChange={(e) => setNewExpense({ ...newExpense, categories: e.target.value })}
                >
                  <option value="">Kategori Seçin</option>
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <input 
                  type="text"
                  placeholder="Gider açıklaması"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tutar</label>
                  <div className="input-with-icon">
                    <span className="currency-symbol">₺</span>
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={newExpense.price}
                      onChange={(e) => setNewExpense({ ...newExpense, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tarih</label>
                  <input 
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Durum</label>
                <select 
                  value={newExpense.status} 
                  onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowAddModal(false)}
              >
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleAddExpense}
                disabled={!newExpense.categories || !newExpense.description || !newExpense.price || !newExpense.date}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </span>
                ) : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
