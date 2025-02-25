import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../screens_css/stock.css';

const Stock = () => {
  // Ürün listesi state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtreler için state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Yeni ürün için state - veritabanı yapısına uygun
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit: 'Adet',
    purchase_price: '',
    sale_price: '',     
    tax_rate: '',      
    stock_quantity: '', 
    min_stock_level: '', 
    status: 'ACTIVE'
  });

  // Kategori listesi
  const categories = [
    'Elektronik',
    'Giyim',
    'Gıda',
    'Kozmetik',
    'Ev Eşyası',
    'Diğer'
  ];

  // Birim listesi
  const unit = [
    'Adet',
    'KG',
    'Metre',
    'Litre',
    'Paket',
    'Diğer'
  ];

  // Düzenleme ve detay işlemleri için state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Ürünleri getir
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Component yüklendiğinde ürünleri getir
  useEffect(() => {
    fetchProducts();
  }, []);

  // Yeni ürün ekleme
  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sayısal değerleri doğru formatta hazırla
      const productData = {
        code: newProduct.code.trim(),
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || '',
        category: newProduct.category,
        unit: newProduct.unit,
        // Backend entity'deki alan isimleriyle eşleştir (camelCase)
        purchasePrice: Number(newProduct.purchase_price),
        salePrice: Number(newProduct.sale_price),
        taxRate: Number(newProduct.tax_rate),
        stockQuantity: Number(newProduct.stock_quantity),
        minStockLevel: Number(newProduct.min_stock_level),
        status: 'ACTIVE'
      };

      console.log('Gönderilen veri:', productData);

      const response = await axios.post('http://localhost:8081/api/products/add', productData);

      console.log('API Yanıtı:', response.data);

      if (response.data) {
        alert('Ürün başarıyla eklendi!');
        setProducts([...products, response.data]);
        setShowAddModal(false);
        setNewProduct({
          code: '',
          name: '',
          description: '',
          category: '',
          unit: 'Adet',
          purchase_price: '',
          sale_price: '',
          tax_rate: '',
          stock_quantity: '',
          min_stock_level: '',
          status: 'ACTIVE'
        });
        fetchProducts();
      }
    } catch (err) {
      console.error('Hata detayı:', err.response || err);
      setError(
        err.response?.data?.message || 
        'Ürün eklenirken bir hata oluştu. Lütfen tüm alanları kontrol ediniz.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const errors = [];
    
    if (!newProduct.code) errors.push('Ürün kodu');
    if (!newProduct.name) errors.push('Ürün adı');
    if (!newProduct.category) errors.push('Kategori');
    if (!newProduct.unit) errors.push('Birim');
    
    // Sayısal değerler için validasyon
    if (isNaN(Number(newProduct.purchase_price)) || Number(newProduct.purchase_price) < 0) {
      errors.push('Geçerli bir alış fiyatı');
    }
    if (isNaN(Number(newProduct.sale_price)) || Number(newProduct.sale_price) < 0) {
      errors.push('Geçerli bir satış fiyatı');
    }
    if (isNaN(Number(newProduct.tax_rate)) || Number(newProduct.tax_rate) < 0) {
      errors.push('Geçerli bir KDV oranı');
    }
    if (isNaN(Number(newProduct.stock_quantity)) || Number(newProduct.stock_quantity) < 0) {
      errors.push('Geçerli bir stok miktarı');
    }
    if (isNaN(Number(newProduct.min_stock_level)) || Number(newProduct.min_stock_level) < 0) {
      errors.push('Geçerli bir minimum stok seviyesi');
    }
    
    if (errors.length > 0) {
      setError(`Lütfen şu alanları düzgün doldurun: ${errors.join(', ')}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  // Düzenleme işlemi
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/api/products/${selectedProduct.id}`, {
        code: selectedProduct.code,
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        unit: selectedProduct.unit,
        purchasePrice: Number(selectedProduct.purchasePrice),
        salePrice: Number(selectedProduct.salePrice),
        taxRate: Number(selectedProduct.taxRate),
        stockQuantity: Number(selectedProduct.stockQuantity),
        minStockLevel: Number(selectedProduct.minStockLevel),
        status: selectedProduct.status
      });

      // Ürün listesini güncelle
      setProducts(products.map(p => p.id === selectedProduct.id ? response.data : p));
      setShowEditModal(false);
      alert('Ürün başarıyla güncellendi!');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Ürün güncellenirken bir hata oluştu!');
    }
  };

  // Düzenleme modalını aç
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Detay modalını aç
  const handleDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // Ürün silme işlemi
  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:8081/api/products/${id}`);
        // Ürün listesini güncelle
        setProducts(products.filter(p => p.id !== id));
        alert('Ürün başarıyla silindi!');
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Ürün silinirken bir hata oluştu!');
      }
    }
  };

  // Filtrelenmiş ürünleri hesapla
  const filteredProducts = products.filter(product => {
    // Hem arama terimini hem de kategori filtresini uygula
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="stock-container">
      {/* Üst başlık ve butonlar */}
      <div className="stock-header">
        <h2>Stok Yönetimi</h2>
        <div className="header-buttons">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stok özeti kartları - filtrelenmiş ürünlere göre güncellendi */}
      <div className="stock-summary">
        <div className="summary-card total">
          <i className="fas fa-box"></i>
          <div>
            <h3>Toplam Ürün</h3>
            <span>{filteredProducts.length}</span>
          </div>
        </div>

        <div className="summary-card low">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <h3>Kritik Stok</h3>
            <span>
              {filteredProducts.filter(p => p.stock_quantity <= p.min_stock_level).length}
            </span>
          </div>
        </div>

        <div className="summary-card value">
          <i className="fas fa-money-bill-wave"></i>
          <div>
            <h3>Stok Değeri</h3>
            <span>
              ₺{filteredProducts.reduce((sum, p) => {
                const purchasePrice = Number(p.purchasePrice) || 0;
                const stockQuantity = Number(p.stockQuantity) || 0;
                return sum + (purchasePrice * stockQuantity);
              }, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Ürün tablosu - filtrelenmiş ürünleri göster */}
      <div className="stock-table-container">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Ürün Kodu</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Alış Fiyatı</th>
                <th>Satış Fiyatı</th>
                <th>Stok</th>
                <th>Birim</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₺{product.purchasePrice ? product.purchasePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'}</td>
                  <td>₺{product.salePrice ? product.salePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'}</td>
                  <td>{product.stockQuantity || 0}</td>
                  <td>{product.unit}</td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase()}`}>
                      {product.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(product)}
                        title="Düzenle"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="details-btn"
                        onClick={() => handleDetails(product)}
                        title="Detaylar"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                        title="Sil"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Yeni ürün ekleme modalı */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Ürün Ekle</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label>Ürün Kodu *</label>
                <input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                  
                />
              </div>

              <div className="form-group">
                <label>Ürün Adı *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Ev Eşyası">Ev Eşyası</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Giyim">Giyim</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Birim</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    {unit.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Alış Fiyatı</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.purchase_price}
                    onChange={(e) => setNewProduct({...newProduct, purchase_price: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Satış Fiyatı</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.sale_price}
                    onChange={(e) => setNewProduct({...newProduct, sale_price: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>KDV Oranı (%)</label>
                  <input
                    type="number"
                    value={newProduct.tax_rate}
                    onChange={(e) => setNewProduct({...newProduct, tax_rate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Stok Miktarı</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Stok Seviyesi</label>
                <input
                  type="number"
                  value={newProduct.min_stock_level}
                  onChange={(e) => setNewProduct({...newProduct, min_stock_level: e.target.value})}
                />
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
                onClick={handleAddProduct}
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Modalı */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ürün Düzenle</h2>
              <button onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Ürün Kodu</label>
                  <input
                    type="text"
                    value={selectedProduct.code}
                    onChange={(e) => setSelectedProduct({...selectedProduct, code: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ürün Adı</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={selectedProduct.description || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Birim</label>
                  <select
                    value={selectedProduct.unit}
                    onChange={(e) => setSelectedProduct({...selectedProduct, unit: e.target.value})}
                  >
                    {unit.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Alış Fiyatı</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.purchasePrice}
                    onChange={(e) => setSelectedProduct({...selectedProduct, purchasePrice: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Satış Fiyatı</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.salePrice}
                    onChange={(e) => setSelectedProduct({...selectedProduct, salePrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>KDV Oranı (%)</label>
                  <input
                    type="number"
                    value={selectedProduct.taxRate}
                    onChange={(e) => setSelectedProduct({...selectedProduct, taxRate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stok Miktarı</label>
                  <input
                    type="number"
                    value={selectedProduct.stockQuantity}
                    onChange={(e) => setSelectedProduct({...selectedProduct, stockQuantity: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Stok Seviyesi</label>
                <input
                  type="number"
                  value={selectedProduct.minStockLevel}
                  onChange={(e) => setSelectedProduct({...selectedProduct, minStockLevel: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>İptal</button>
              <button className="save-btn" onClick={handleEditSubmit}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Detay Modalı */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ürün Detayları</h2>
              <button onClick={() => setShowDetailsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <label>Ürün Kodu:</label>
                <span>{selectedProduct.code}</span>
              </div>
              <div className="detail-row">
                <label>Ürün Adı:</label>
                <span>{selectedProduct.name}</span>
              </div>
              <div className="detail-row">
                <label>Açıklama:</label>
                <span>{selectedProduct.description || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Kategori:</label>
                <span>{selectedProduct.category}</span>
              </div>
              <div className="detail-row">
                <label>Birim:</label>
                <span>{selectedProduct.unit}</span>
              </div>
              <div className="detail-row">
                <label>Alış Fiyatı:</label>
                <span>₺{selectedProduct.purchasePrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="detail-row">
                <label>Satış Fiyatı:</label>
                <span>₺{selectedProduct.salePrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="detail-row">
                <label>KDV Oranı:</label>
                <span>%{selectedProduct.taxRate}</span>
              </div>
              <div className="detail-row">
                <label>Stok Miktarı:</label>
                <span>{selectedProduct.stockQuantity}</span>
              </div>
              <div className="detail-row">
                <label>Min. Stok Seviyesi:</label>
                <span>{selectedProduct.minStockLevel}</span>
              </div>
              <div className="detail-row">
                <label>Durum:</label>
                <span>{selectedProduct.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
