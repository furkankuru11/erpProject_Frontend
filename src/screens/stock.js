import React, { useState } from 'react';
import '../screens_css/stock.css';

const Stock = () => {
  // Örnek stok verileri
  const [stocks] = useState([
    { id: 1, name: 'Ürün A', quantity: 150, minStock: 50, price: 1200, category: 'Elektronik' },
    { id: 2, name: 'Ürün B', quantity: 30, minStock: 40, price: 800, category: 'Giyim' },
    { id: 3, name: 'Ürün C', quantity: 80, minStock: 60, price: 2500, category: 'Mobilya' },
    { id: 4, name: 'Ürün D', quantity: 25, minStock: 45, price: 1500, category: 'Elektronik' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="stock-container">
      <div className="stock-header">
        <h1>Stok Yönetimi</h1>
        <div className="header-actions">
          <button className="add-stock-btn">
            <i className="fas fa-plus"></i>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <div className="stock-overview">
        <div className="overview-card">
          <i className="fas fa-boxes"></i>
          <div>
            <h3>Toplam Ürün</h3>
            <span>{stocks.length}</span>
          </div>
        </div>
        <div className="overview-card warning">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <h3>Kritik Stok</h3>
            <span>{stocks.filter(s => s.quantity < s.minStock).length}</span>
          </div>
        </div>
        <div className="overview-card success">
          <i className="fas fa-check-circle"></i>
          <div>
            <h3>Normal Stok</h3>
            <span>{stocks.filter(s => s.quantity >= s.minStock).length}</span>
          </div>
        </div>
      </div>

      <div className="stock-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filters">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            Tümü
          </button>
        </div>
      </div>

      <div className="stock-table">
        <table>
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Min. Stok</th>
              <th>Fiyat</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <td>{stock.name}</td>
                <td>
                  <span className="category-tag">{stock.category}</span>
                </td>
                <td>{stock.quantity}</td>
                <td>{stock.minStock}</td>
                <td>₺{stock.price.toLocaleString()}</td>
                <td>
                  <span className={`status ${stock.quantity < stock.minStock ? 'low' : 'normal'}`}>
                    {stock.quantity < stock.minStock ? 'Kritik' : 'Normal'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button title="Stok Ekle">
                      <i className="fas fa-plus"></i>
                    </button>
                    <button title="Düzenle">
                      <i className="fas fa-edit"></i>
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
      </div>
    </div>
  );
};

export default Stock;


