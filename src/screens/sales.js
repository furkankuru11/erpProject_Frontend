import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../screens_css/sales.css';

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Yeni sipariş state'i
  const [newOrder, setNewOrder] = useState({
    orderNumber: '',
    companyId: '',
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    status: 'DRAFT',
    totalAmount: 0,
    taxAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    notes: '',
    orderType: 'company', // company veya individual
    productIds: []
  });

  // Verileri getir fonksiyonunu component scope'una taşıyalım
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const [ordersRes, companiesRes, customersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:8081/api/sales-orders', config),
        axios.get('http://localhost:8081/api/companies', config),
        axios.get('http://localhost:8081/api/customers', config),
        axios.get('http://localhost:8081/api/products', config)
      ]);

      setOrders(ordersRes.data);
      setCompanies(companiesRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setError(null);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect içinde fetchData'yı çağır
  useEffect(() => {
    fetchData();
  }, []);

  // Sipariş oluştur
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const orderData = {
        ...newOrder,
        orderNumber: `SO${Date.now()}`,
        companyId: newOrder.orderType === 'company' ? newOrder.companyId : null,
        customerId: newOrder.orderType === 'individual' ? newOrder.customerId : null,
        totalAmount: Number(newOrder.totalAmount),
        taxAmount: Number(newOrder.taxAmount),
        discountAmount: Number(newOrder.discountAmount),
        netAmount: Number(newOrder.netAmount),
        created_by: 1, // Aktif kullanıcının ID'si
        productIds: newOrder.productIds || []
      };

      await axios.post('http://localhost:8081/api/sales-orders', orderData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setShowAddModal(false);
      // Formu temizle
      setNewOrder({
        orderNumber: '',
        companyId: '',
        customerId: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        status: 'DRAFT',
        totalAmount: 0,
        taxAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        notes: '',
        orderType: 'company',
        productIds: []
      });
      
      // Siparişleri yeniden yükle
      fetchData();
      setError(null);
    } catch (err) {
      setError('Sipariş oluşturulurken bir hata oluştu: ' + err.message);
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrelenmiş siparişleri getir
  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (companies.find(c => c.id === order.companyId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customers.find(c => c.id === order.customerId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

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
        {getFilteredOrders().map(order => (
          <div key={order.id} className="sale-item">
            <span className="sale-id">{order.orderNumber}</span>
            <span className="customer-name">{companies.find(c => c.id === order.companyId)?.name || customers.find(c => c.id === order.customerId)?.name || ''}</span>
            <span className="products">
              {products.filter(p => order.productIds.includes(p.id)).map(p => p.name).join(', ')}
            </span>
            <span className="total">₺{order.totalAmount.toLocaleString()}</span>
            <span className="date">
              {new Date(order.orderDate).toLocaleDateString('tr-TR')}
            </span>
            <span className={`status ${order.status}`}>
              {order.status === 'completed' ? 'Tamamlandı' :
               order.status === 'pending' ? 'Bekliyor' : 'İşlemde'}
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
          {products.map(product => (
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