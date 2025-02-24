import React, { useState } from 'react';
import '../screens_css/expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: 'Personel',
      description: 'Maaş Ödemeleri',
      amount: 45000,
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      category: 'Kira',
      description: 'Mart Ayı Kira',
      amount: 12000,
      date: '2024-03-01',
      status: 'completed'
    },
    {
      id: 3,
      category: 'Utilities',
      description: 'Elektrik Faturası',
      amount: 2500,
      date: '2024-03-10',
      status: 'pending'
    }
  ]);

  const categories = [
    { id: 'personel', name: 'Personel', icon: 'fa-users' },
    { id: 'kira', name: 'Kira', icon: 'fa-building' },
    { id: 'utilities', name: 'Utilities', icon: 'fa-bolt' },
    { id: 'stock', name: 'Stok', icon: 'fa-box' },
    { id: 'other', name: 'Diğer', icon: 'fa-ellipsis-h' }
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: '',
    date: ''
  });

  const handleAddExpense = () => {
    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      status: 'pending'
    };
    setExpenses([...expenses, expense]);
    setShowAddModal(false);
    setNewExpense({ category: '', description: '', amount: '', date: '' });
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Gider Yönetimi</h2>
        <button className="add-expense-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i>
          Yeni Gider Ekle
        </button>
      </div>

      <div className="category-cards">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <i className={`fas ${category.icon}`}></i>
            <h3>{category.name}</h3>
            <p>₺{expenses
              .filter(exp => exp.category === category.name)
              .reduce((sum, exp) => sum + exp.amount, 0)
              .toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="expenses-table-container">
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
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>₺{expense.amount.toLocaleString()}</td>
                <td>{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                <td>
                  <span className={`status-badge ${expense.status}`}>
                    {expense.status === 'completed' ? 'Ödendi' : 'Beklemede'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="">Seçiniz</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <input 
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tutar</label>
                <input 
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tarih</label>
                <input 
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                İptal
              </button>
              <button className="save-btn" onClick={handleAddExpense}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses; 