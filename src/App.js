import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from 'react';
import Login from "./auth/login";
import Register from "./auth/register";
import Dashboard from "./screens/dashboard";
import Sales from "./screens/sales";
import Stock from "./screens/stock";
import Companies from "./screens/companies";
import Payment from "./screens/payment";
import Report from "./screens/report";
import UserManagment from "./screens/user_management";
import Expenses from "./screens/expenses";
import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    return <Navigate to="/login" />;
  };

  // Kullanıcı girişi yapılmamışsa, login sayfasına yönlendir
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <h3>ERP Sistemi</h3>
            </div>
            <nav className="sidebar-nav">
              <Link to="/" className="sidebar-link">
                <i className="fas fa-home"></i>
                <span>Ana Sayfa</span>
              </Link>
              
              <Link to="/sales" className="sidebar-link">
                <i className="fas fa-shopping-cart"></i>
                <span>Satış Yönetimi</span>
              </Link>
              <Link to="/stock" className="sidebar-link">
                <i className="fas fa-boxes"></i>
                <span>Stok Yönetimi</span>
              </Link>
              <Link to="/companies" className="sidebar-link">
                <i className="fas fa-building"></i>
                <span>Şirketler & Müşteriler</span>
              </Link>
              <Link to="/payment" className="sidebar-link">
                <i className="fas fa-credit-card"></i>
                <span>Ödeme Yönetimi</span>
              </Link>
              <Link to="/expenses" className="sidebar-link">
                <i className="fas fa-wallet"></i>
                <span>Giderler</span>
              </Link>
              <Link to="/report" className="sidebar-link">
                <i className="fas fa-chart-bar"></i>
                <span>Raporlar</span>
              </Link>
              <Link to="/user_managment" className="sidebar-link">
                <i className="fas fa-users-cog"></i>
                <span>Kullanıcı Yönetimi</span>
              </Link>
              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                <span>Çıkış</span>
              </button>
            </nav>
          </aside>
        )}

        {/* Çıkış Onay Modalı */}
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h3>Çıkış Onayı</h3>
                <p>Çıkmak istediğinize emin misiniz?</p>
                <div className="modal-actions">
                  <button onClick={() => setShowLogoutModal(false)} className="cancel-btn">
                    İptal
                  </button>
                  <button onClick={confirmLogout} className="confirm-btn">
                    Evet, Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`main-wrapper ${!isAuthenticated ? 'full-width' : ''}`}>
          <main className="main-content">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/sales" element={
                <PrivateRoute>
                  <Sales />
                </PrivateRoute>
              } />
              <Route path="/stock" element={
                <PrivateRoute>
                  <Stock />
                </PrivateRoute>
              } />
              <Route path="/companies" element={
                <PrivateRoute>
                  <Companies />
                </PrivateRoute>
              } />
              <Route path="/payment" element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              } />
              <Route path="/expenses" element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              } />
              <Route path="/report" element={
                <PrivateRoute>
                  <Report />
                </PrivateRoute>
              } />
              <Route path="/user_managment" element={
                <PrivateRoute>
                  <UserManagment />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
