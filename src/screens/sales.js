import React, { useState } from 'react';
import '../screens_css/sales.css';

const Sales = () => {
  // Örnek satış verileri
  const [sales] = useState({
    recentSales: [
      { id: 'S001', customer: 'Ahmet Yılmaz', products: ['Ürün A', 'Ürün B'], total: 2500, date: '2024-03-20', status: 'completed' },
      { id: 'S002', customer: 'Mehmet Demir', products: ['Ürün C'], total: 1800, date: '2024-03-19', status: 'pending' },
      { id: 'S003', customer: 'Ayşe Kaya', products: ['Ürün D', 'Ürün E'], total: 3200, date: '2024-03-18', status: 'processing' },
    ],
    products: [
      { id: 'P001', name: 'Ürün A', price: 1200, stock: 45 },
      { id: 'P002', name: 'Ürün B', price: 1500, stock: 30 },
      { id: 'P003', name: 'Ürün C', price: 1800, stock: 25 },
    ]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="sales-container">
      {/* Üst Başlık ve Eylemler */}
      <div className="sales-header">
        <div className="header-left">
          <h1>Satış Yönetimi</h1>
        </div>
        <div className="header-actions">
          <button className="action-button primary">
            <i className="fas fa-plus"></i>
            Yeni Satış
          </button>
          <button className="action-button">
            <i className="fas fa-file-export"></i>
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="sales-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Satış veya müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tümü
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Tamamlanan
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Bekleyen
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('processing')}
          >
            İşlemde
          </button>
        </div>
      </div>

      {/* Satış Listesi */}
      <div className="sales-list">
        <div className="list-header">
          <span>Satış No</span>
          <span>Müşteri</span>
          <span>Ürünler</span>
          <span>Toplam</span>
          <span>Tarih</span>
          <span>Durum</span>
          <span>İşlemler</span>
        </div>
        {sales.recentSales.map(sale => (
          <div key={sale.id} className="sale-item">
            <span className="sale-id">{sale.id}</span>
            <span className="customer-name">{sale.customer}</span>
            <span className="products">
              {sale.products.join(', ')}
            </span>
            <span className="total">₺{sale.total.toLocaleString()}</span>
            <span className="date">
              {new Date(sale.date).toLocaleDateString('tr-TR')}
            </span>
            <span className={`status ${sale.status}`}>
              {sale.status === 'completed' ? 'Tamamlandı' :
               sale.status === 'pending' ? 'Bekliyor' : 'İşlemde'}
            </span>
            <div className="actions">
              <button className="icon-button" title="Düzenle">
                <i className="fas fa-edit"></i>
              </button>
              <button className="icon-button" title="Detaylar">
                <i className="fas fa-eye"></i>
              </button>
              <button className="icon-button" title="Sil">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı Ürün Ekleme */}
      <div className="quick-add-section">
        <h2>Hızlı Ürün Ekleme</h2>
        <div className="product-grid">
          {sales.products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <span className="price">₺{product.price.toLocaleString()}</span>
                <span className="stock">Stok: {product.stock}</span>
              </div>
              <button className="add-button">
                <i className="fas fa-plus"></i>
                Ekle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sales; 