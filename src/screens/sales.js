import React, { useState, useEffect } from 'react';
import '../screens_css/sales.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api';

const Sales = () => {
  // State tanımlamaları
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([
    { value: 'company', label: 'Kurumsal' },
    { value: 'individual', label: 'Bireysel' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Yeni sipariş state'ini güncelle
  const [newOrder, setNewOrder] = useState({
    orderNumber: '',
    company: null,
    customer: null,
    orderDate: new Date().toISOString(),
    deliveryDate: '',
    status: 'DRAFT',
    totalAmount: 0,
    taxAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    notes: '',
    orderType: 'company'
  });

  // Loading state ekle
  const [isSaving, setIsSaving] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'DRAFT', label: 'Taslak' },
    { value: 'CONFIRMED', label: 'Onaylandı' },
    { value: 'SHIPPED', label: 'Kargoda' },
    { value: 'DELIVERED', label: 'Teslim Edildi' },
    { value: 'CANCELLED', label: 'İptal Edildi' }
  ];

  // Filtreleme fonksiyonu
  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (companies.find(c => c.id === order.company_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customers.find(c => c.id === order.customer_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  // Siparişleri getir
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/sales-orders`);
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      setError('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Sipariş sil
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`${API_BASE_URL}/sales-orders/${orderId}`);
        alert('Sipariş başarıyla silindi.');
        fetchOrders(); // Listeyi yenile
      } catch (error) {
        console.error('Sipariş silinirken hata:', error);
        alert('Sipariş silinirken bir hata oluştu.');
      }
    }
  };

  // Kaydetme fonksiyonunu güncelle
  const handleCreateOrder = async () => {
    setIsSaving(true);
    try {
      // Backend'e gönderilecek veriyi hazırla
      const orderData = {
        companyId: newOrder.orderType === 'company' ? newOrder.company?.id : null,
        customerId: newOrder.orderType === 'individual' ? newOrder.customer?.id : null,
        orderDate: new Date(newOrder.orderDate).toISOString(),
        deliveryDate: newOrder.deliveryDate ? new Date(newOrder.deliveryDate).toISOString() : null,
        status: "DRAFT",
        totalAmount: Number(newOrder.totalAmount),
        taxAmount: Number(newOrder.taxAmount),
        discountAmount: Number(newOrder.discountAmount),
        netAmount: Number(newOrder.netAmount),
        notes: newOrder.notes || "",
        productId: Number(selectedProduct),
        quantity: Number(quantity)
      };

      // İstek öncesi veriyi kontrol et
      console.log('Gönderilecek veri:', orderData);

      // Backend'e POST isteği gönder
      const response = await axios.post(`${API_BASE_URL}/sales-orders`, orderData);

      if (response.data) {
        // Stok güncelleme
        await updateStock(selectedProduct, quantity);
        
        setShowAddModal(false);
        
        // State'i sıfırla
        setNewOrder({
          orderNumber: '',
          company: null,
          customer: null,
          orderDate: new Date().toISOString(),
          deliveryDate: '',
          status: 'DRAFT',
          totalAmount: 0,
          taxAmount: 0,
          discountAmount: 0,
          netAmount: 0,
          notes: '',
          orderType: 'company'
        });
        setSelectedProduct('');
        setQuantity(1);

        alert('Sipariş başarıyla oluşturuldu!');
        fetchOrders();
      }
    } catch (error) {
      console.error('Sipariş oluşturulurken hata:', error);
      console.log('Hata detayı:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      let errorMessage = 'Sipariş oluşturulurken bir hata oluştu.';
      
      if (error.response) {
        if (error.response.data && typeof error.response.data === 'object') {
          // Detaylı hata mesajlarını birleştir
          const messages = [];
          for (const key in error.response.data) {
            if (typeof error.response.data[key] === 'string') {
              messages.push(error.response.data[key]);
            } else if (Array.isArray(error.response.data[key])) {
              messages.push(...error.response.data[key]);
            }
          }
          errorMessage = messages.join('\n') || errorMessage;
        } else {
          errorMessage = error.response.data || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Stok ürünlerini getir
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setError('Ürünler yüklenemedi');
    }
  };

  // Müşterileri getir
  const fetchCustomers = async () => {
    try {
      const [companiesResponse, customersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/companies`),
        axios.get(`${API_BASE_URL}/customers`)
      ]);

      setCompanies(companiesResponse.data);
      setCustomers(customersResponse.data);
      setError(null);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata:', error);
      setError('Müşteri bilgileri yüklenirken bir hata oluştu.');
    }
  };

  // Component yüklendiğinde verileri getir
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchOrders(),
          fetchCustomers(),
          fetchProducts()
        ]);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stok güncelleme fonksiyonu
  const updateStock = async (productId, soldQuantity) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newStockQuantity = product.stockQuantity - soldQuantity;
      
      await axios.put(`${API_BASE_URL}/products/${productId}`, {
        ...product,
        stockQuantity: newStockQuantity
      });

      // Stok listesini güncelle
      await fetchProducts();
    } catch (error) {
      console.error('Stok güncellenirken hata:', error);
      throw new Error('Stok güncellenemedi');
    }
  };

  // Satış ekleme fonksiyonunu güncelle
  const handleAddSale = async () => {
    if (!selectedProduct || quantity < 1) {
      setError('Lütfen ürün ve adet seçin');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      setError('Seçili ürün bulunamadı');
      return;
    }

    if (product.stockQuantity < quantity) {
      setError('Yetersiz stok miktarı');
      return;
    }

    try {
      setLoading(true);
      
      // Önce satışı kaydet
      const saleResponse = await axios.post(`${API_BASE_URL}/sales`, {
        // ... existing sale data ...
        productId: selectedProduct,
        quantity: quantity,
        totalAmount: product.salePrice * quantity
      });

      // Sonra stoku güncelle
      await updateStock(selectedProduct, quantity);

      setShowAddModal(false);
      // State'leri sıfırla
      setSelectedProduct('');
      setQuantity(1);
      fetchOrders(); // Satışları yenile
    } catch (error) {
      console.error('Satış eklenirken hata:', error);
      setError('Satış eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Özet bilgileri hesapla
  const getSummary = () => {
    return {
      totalSales: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
      totalOrders: orders.length,
      activeOrders: orders.filter(order => !['DELIVERED', 'CANCELLED'].includes(order.status)).length,
      totalCustomers: new Set([
        ...orders.filter(o => o.company_id).map(o => o.company_id),
        ...orders.filter(o => o.customer_id).map(o => o.customer_id)
      ]).size
    };
  };

  return (
    <div className="sales-container">
      {/* Header */}
      <div className="sales-header">
        <div className="header-left">
          <h1>Satış Yönetimi</h1>
        </div>
        <div className="header-actions">
          <button 
            className="action-button primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus"></i>
            Yeni Satış
          </button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="card-content">
            <h3>Toplam Satış</h3>
            <p>₺{(getSummary().totalSales || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div className="card-content">
            <h3>Toplam Sipariş</h3>
            <p>{getSummary().totalOrders}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="card-content">
            <h3>Aktif Sipariş</h3>
            <p>{getSummary().activeOrders}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="card-content">
            <h3>Toplam Müşteri</h3>
            <p>{getSummary().totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Yükleme ve hata durumları */}
      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Siparişler yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Filtreler */}
          <div className="sales-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Sipariş no veya müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <button 
                className="dropdown-trigger"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <span>
                  {statusOptions.find(option => option.value === filterStatus)?.label || 'Durum Filtrele'}
                </span>
                <i className={`fas fa-chevron-${showStatusDropdown ? 'up' : 'down'}`}></i>
              </button>
              {showStatusDropdown && (
                <div className="dropdown-menu">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      className={`dropdown-item ${filterStatus === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setFilterStatus(option.value);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Satış Listesi */}
          <div className="sales-list">
            <div className="list-header">
              <span>Sipariş No</span>
              <span>Müşteri</span>
              <span>Sipariş Tarihi</span>
              <span>Teslimat Tarihi</span>
              <span>Tutar</span>
              <span>Durum</span>
              <span>İşlemler</span>
            </div>
            {getFilteredOrders().map(order => (
              <div key={order.id} className="sale-item">
                <span>{order.order_number}</span>
                <span>
                  {order.company_id 
                    ? companies.find(c => c.id === order.company_id)?.name 
                    : customers.find(c => c.id === order.customer_id)?.name}
                </span>
                <span>{new Date(order.order_date).toLocaleDateString('tr-TR')}</span>
                <span>
                  {order.delivery_date 
                    ? new Date(order.delivery_date).toLocaleDateString('tr-TR')
                    : '-'}
                </span>
                <span>
                  <div className="amount-details">
                    <span className="total-amount">
                      ₺{(order.total_amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="tax-discount">
                      {(order.tax_amount || 0) > 0 && 
                        <span className="tax">+KDV: ₺{(order.tax_amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                      }
                      {(order.discount_amount || 0) > 0 && 
                        <span className="discount">-İnd: ₺{(order.discount_amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                      }
                    </span>
                  </div>
                </span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status === 'DRAFT' ? 'Taslak' :
                   order.status === 'CONFIRMED' ? 'Onaylandı' :
                   order.status === 'SHIPPED' ? 'Kargoda' :
                   order.status === 'DELIVERED' ? 'Teslim Edildi' : 
                   order.status === 'CANCELLED' ? 'İptal Edildi' : 'N/A'}
                </span>
                <div className="actions">
                  <button className="icon-button" title="Düzenle">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="icon-button" 
                    title="Sil"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Satış Oluştur</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              {error && <div className="error-message">{error}</div>}
              
              {/* Müşteri Bilgileri */}
              <div className="form-section">
                <h4>Müşteri Bilgileri</h4>
                <div className="form-group">
                  <label>Müşteri Tipi</label>
                  <select 
                    value={newOrder.orderType}
                    onChange={(e) => setNewOrder({...newOrder, orderType: e.target.value, company: null, customer: null})}
                  >
                    <option value="">Seçiniz</option>
                    {customerTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {newOrder.orderType && (
                  <div className="form-group">
                    <label>{newOrder.orderType === 'company' ? 'Firma' : 'Müşteri'}</label>
                    <select
                      value={newOrder.orderType === 'company' ? newOrder.company?.id : newOrder.customer?.id}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!value) {
                          setNewOrder({
                            ...newOrder,
                            company: null,
                            customer: null
                          });
                          return;
                        }

                        const selected = newOrder.orderType === 'company' 
                          ? companies.find(c => c.id === Number(value))
                          : customers.find(c => c.id === Number(value));
                        
                        setNewOrder({
                          ...newOrder,
                          company: newOrder.orderType === 'company' ? selected : null,
                          customer: newOrder.orderType === 'individual' ? selected : null
                        });
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {newOrder.orderType === 'company' 
                        ? companies.map(company => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))
                        : customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} {customer.surname}
                            </option>
                          ))
                      }
                    </select>
                  </div>
                )}
              </div>

              {/* Sipariş Detayları */}
              <div className="form-section">
                <h4>Sipariş Detayları</h4>
                
                <div className="form-group">
                  <label>Stoktan Ürün</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => {
                      const productId = e.target.value;
                      setSelectedProduct(productId);
                      if (productId) {
                        const product = products.find(p => p.id === Number(productId));
                        if (product) {
                          const salePrice = Number(product.salePrice) || 0;
                          setNewOrder({
                            ...newOrder,
                            totalAmount: salePrice,
                            taxAmount: salePrice * 0.18,
                            netAmount: (salePrice * 1.18) - (newOrder.discountAmount || 0)
                          });
                        }
                      } else {
                        // Ürün seçimi kaldırıldığında değerleri sıfırla
                        setNewOrder({
                          ...newOrder,
                          totalAmount: 0,
                          taxAmount: 0,
                          netAmount: 0
                        });
                      }
                    }}
                    className="product-select"
                  >
                    <option value="">Ürün Seçin</option>
                    {products.map(product => (
                      <option 
                        key={product.id} 
                        value={product.id}
                        disabled={!product?.stockQuantity || product.stockQuantity < 1}
                      >
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <small className="product-info">
                      Stok: {products.find(p => p.id === Number(selectedProduct))?.stockQuantity || 0} | 
                      Fiyat: ₺{(products.find(p => p.id === Number(selectedProduct))?.salePrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </small>
                  )}
                </div>

                {selectedProduct && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Satış Adedi</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const newQuantity = Number(e.target.value);
                          setQuantity(newQuantity);
                          const product = products.find(p => p.id === selectedProduct);
                          if (product) {
                            const total = product.salePrice * newQuantity;
                            setNewOrder({
                              ...newOrder,
                              totalAmount: total,
                              taxAmount: total * 0.18,
                              netAmount: total * 1.18 - newOrder.discountAmount
                            });
                          }
                        }}
                        max={products.find(p => p.id === selectedProduct)?.stockQuantity}
                      />
                      <small className="stock-info">
                        Mevcut Stok: {products.find(p => p.id === selectedProduct)?.stockQuantity}
                      </small>
                    </div>

                    <div className="form-group">
                      <label>İndirim Tutarı</label>
                      <input 
                        type="number"
                        value={newOrder.discountAmount}
                        onChange={(e) => {
                          const discount = Number(e.target.value);
                          setNewOrder({
                            ...newOrder, 
                            discountAmount: discount,
                            netAmount: newOrder.totalAmount + newOrder.taxAmount - discount
                          });
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Sipariş Tarihi</label>
                    <input 
                      type="datetime-local"
                      value={newOrder.orderDate.slice(0, 16)}
                      onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Teslimat Tarihi</label>
                    <input 
                      type="datetime-local"
                      value={newOrder.deliveryDate}
                      onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notlar</label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>

              {/* Özet Bilgiler */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Ara Toplam:</span>
                  <span>₺{(newOrder.totalAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-row">
                  <span>KDV (%18):</span>
                  <span>₺{(newOrder.taxAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-row">
                  <span>İndirim:</span>
                  <span>₺{(newOrder.discountAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-row total">
                  <span>Genel Toplam:</span>
                  <span>₺{(newOrder.netAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowAddModal(false)}
                disabled={loading}
              >
                İptal
              </button>
              <button 
                className="save-btn" 
                onClick={handleCreateOrder}
                disabled={
                  loading ||
                  !selectedProduct ||
                  quantity < 1 ||
                  (!newOrder.company && !newOrder.customer) ||
                  !newOrder.orderDate
                }
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

export default Sales;