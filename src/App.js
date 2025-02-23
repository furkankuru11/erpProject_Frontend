import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import Sales from "./screens/sales";
import Stock from "./screens/stock";
import Companies from "./screens/companies";
import Payment from "./screens/payment";
import Report from "./screens/report";
import UserManagment from "./screens/user_managment";
import Settings from "./screens/settings";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
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
            <Link to="/report" className="sidebar-link">
              <i className="fas fa-chart-bar"></i>
              <span>Raporlar</span>
            </Link>
            <Link to="/user_managment" className="sidebar-link">
              <i className="fas fa-users-cog"></i>
              <span>Kullanıcı Yönetimi</span>
            </Link>
            <Link to="/settings" className="sidebar-link">
              <i className="fas fa-cog"></i>
              <span>Ayarlar</span>
            </Link>
            <Link to="/logout" className="sidebar-link">
              <i className="fas fa-sign-out-alt"></i>
              <span>Çıkış</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-wrapper">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/report" element={<Report />} />
              <Route path="/user_managment" element={<UserManagment />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
