import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api';

// Enum değerleri
const ExpenseCategory = {
  PERSONNEL: 'Personel',
  OFFICE: 'Ofis',
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
  { value: ExpenseCategory.OFFICE, label: 'Ofis' },
  { value: ExpenseCategory.RENT, label: 'Kira' },
  { value: ExpenseCategory.BILL, label: 'Fatura' },
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

  // Test fonksiyonu - geliştirme aşamasında kullanılabilir
  const testAddExpense = async () => {
    try {
      const testExpense = {
        categories: "Personel",
        description: "Test Gider",
        price: 1000.00,
        date: "2024-03-21",
        status: "PAID"
      };

      const result = await addExpense(testExpense);
      console.log('Test başarılı:', result);
      await fetchExpenses(); // Listeyi güncelle
    } catch (error) {
      console.error('Test başarısız:', error);
    }
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
    <div className="expense-management">
      <h1>Gider Yönetim Sistemi</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <button onClick={() => setShowAddModal(true)}>+ Yeni Gider Ekle</button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Açıklama</th>
            <th>Tutar</th>
            <th>Tarih</th>
            <th>Durum</th>
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
                <td>{categoryOptions.find(cat => cat.value === expense.categories)?.label}</td>
                <td>{expense.description}</td>
                <td>{Number(expense.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</td>
                <td>{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                <td>{statusOptions.find(opt => opt.value === expense.status)?.label}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal">
          <h2>Yeni Gider Ekle</h2>
          <select 
            value={newExpense.categories} 
            onChange={(e) => setNewExpense({ ...newExpense, categories: e.target.value })}
            required
          >
            <option value="">Kategori Seçin</option>
            {categoryOptions.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Açıklama"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Tutar"
            value={newExpense.price}
            onChange={(e) => setNewExpense({ ...newExpense, price: e.target.value })}
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            required
          />
          <select 
            value={newExpense.status} 
            onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
            required
          >
            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div className="modal-buttons">
            <button 
              className="save-button" 
              onClick={handleAddExpense}
              disabled={!newExpense.categories || !newExpense.description || !newExpense.price || !newExpense.date}
            >
              Ekle
            </button>
            <button 
              className="cancel-button" 
              onClick={() => setShowAddModal(false)}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Test butonu - sadece geliştirme ortamında görünür */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={testAddExpense}
          style={{ marginLeft: '10px', backgroundColor: '#ff9800' }}
        >
          Test Gider Ekle
        </button>
      )}
    </div>
  );
};

export default ExpenseManagement;
